import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react'
import { useMemo, useRef, useState } from 'react'
import { IMAGE_GUIDELINES, type ImageEntityType } from '../../data/imageGuidelines'

const placeholderImage = 'https://placehold.co/800x800/1f2937/ffffff?text=Image+Preview'

interface ImageUploadFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  entityType: ImageEntityType
  error?: string
  isRequired?: boolean
  placeholder?: string
  allowUpload?: boolean
  maxSizeMB?: number
  isUploading?: boolean
  onFileChange?: (file: File | null) => void | Promise<void>
}

/**
 * Admin form field for an image: either a file picker (`allowUpload`) or a URL input.
 * Shows a thumbnail preview, the detected size, and warnings when the image is smaller or a
 * different shape than the recommended size for `entityType` (see data/imageGuidelines.ts).
 */
export function ImageUploadField({
  label,
  value,
  onChange,
  entityType,
  error,
  isRequired = false,
  placeholder = 'https://example.com/image.jpg',
  allowUpload = false,
  maxSizeMB = 5,
  isUploading = false,
  onFileChange,
}: ImageUploadFieldProps) {
  const [detectedSize, setDetectedSize] = useState<{ width: number; height: number } | null>(null)
  const [hasLoadError, setHasLoadError] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [localError, setLocalError] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const guideline = IMAGE_GUIDELINES[entityType]
  const helperTextColor = useColorModeValue('gray.600', 'gray.300')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const urlIsValid = useMemo(() => {
    if (!value) return false
    try {
      const parsed = new URL(value)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'data:'
    } catch {
      return false
    }
  }, [value])

  const hasSizeWarning = detectedSize
    ? detectedSize.width < guideline.minWidth || detectedSize.height < guideline.minHeight
    : false

  const ratioMismatch = detectedSize
    ? Math.abs((detectedSize.width / detectedSize.height) - (Number(guideline.recommendedWidth) / Number(guideline.recommendedHeight))) > 0.2
    : false

  const imageSource = localPreview || (value && urlIsValid && !hasLoadError ? value : placeholderImage)

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    if (!file) {
      setLocalPreview(null)
      setLocalError('')
      onFileChange?.(null)
      event.target.value = ''
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setLocalError('Only JPG, PNG, and WEBP images are allowed.')
      event.target.value = ''
      return
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`Image must be ${maxSizeMB}MB or smaller.`)
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setLocalPreview(String(reader.result ?? ''))
      setLocalError('')
    }
    reader.readAsDataURL(file)

    await onFileChange?.(file)
    event.target.value = ''
  }

  const handleClear = () => {
    setLocalPreview(null)
    setLocalError('')
    onChange('')
    onFileChange?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <FormControl isInvalid={Boolean(error || localError) || (!!value && !urlIsValid && !localPreview)}>
      <FormLabel>{label}{isRequired ? ' *' : ''}</FormLabel>

      {allowUpload ? (
        <Stack spacing={3}>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileSelection}
          />

          {isUploading ? (
            <Alert status="info" borderRadius="md">
              <Spinner size="sm" mr={3} />
              Uploading image…
            </Alert>
          ) : null}

          {localError || error ? (
            <Alert status="error" borderRadius="md">
              {localError || error}
            </Alert>
          ) : null}

          {(value || localPreview) && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              Remove image
            </Button>
          )}
        </Stack>
      ) : (
        <Input
          value={value}
          onChange={(event) => {
            setHasLoadError(false)
            setLocalPreview(null)
            onChange(event.target.value)
          }}
          placeholder={placeholder}
          color="gray.900"
          bg="white"
          _placeholder={{ color: 'gray.500' }}
        />
      )}

      <HStack spacing={3} mt={3} align="center">
        <Box border="1px solid" borderColor={borderColor} borderRadius="md" p={2} bg={useColorModeValue('gray.50', 'gray.800')}>
          <Image
            src={imageSource}
            alt={`${label} preview`}
            boxSize="72px"
            objectFit="cover"
            borderRadius="md"
            onLoad={(event) => {
              const target = event.currentTarget
              setDetectedSize({ width: target.naturalWidth, height: target.naturalHeight })
              setHasLoadError(false)
            }}
            onError={() => {
              setHasLoadError(true)
              setDetectedSize(null)
            }}
          />
        </Box>
        <Stack spacing={0}>
          <Text fontSize="xs" color={helperTextColor}>Detected: {detectedSize ? `${detectedSize.width} x ${detectedSize.height}px` : 'Waiting for image'}</Text>
          {hasSizeWarning && (
            <Text fontSize="xs" color="orange.500">Warning: image is smaller than the recommended minimum and may look blurry or get cropped.</Text>
          )}
          {ratioMismatch && (
            <Text fontSize="xs" color="orange.500">Warning: aspect ratio differs from the recommended {guideline.aspectRatio}. It may crop or stretch.</Text>
          )}
        </Stack>
      </HStack>

      <FormHelperText mt={3} color={helperTextColor}>
        <HStack align="start" spacing={2}>
          <Text>Recommended: {guideline.recommendedWidth} × {guideline.recommendedHeight}px</Text>
          <Tooltip label={`${guideline.displayNote} Derived from ${guideline.derivedFrom}.`}>
            <Box as="span" display="inline-flex" alignItems="center">
              <InfoOutlineIcon aria-label="Image guidance tooltip" />
            </Box>
          </Tooltip>
        </HStack>
        <Text>Aspect ratio: {guideline.aspectRatio} • Formats: {guideline.formats.join(', ')} • Max size: {guideline.maxSizeMB} MB</Text>
      </FormHelperText>

      {!allowUpload && error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      {!allowUpload && !!value && !urlIsValid && !error ? <FormErrorMessage>Enter a valid http(s) or data URL.</FormErrorMessage> : null}
    </FormControl>
  )
}
