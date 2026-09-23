import { Alert, Box, Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Image, Input, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { validateUploadedImage } from '../../lib/supabase'

interface GameLogoDropzoneFieldProps {
  value: string
  file: File | null
  error?: string
  onChange: (file: File | null) => void
  onRemove: () => void
}

/**
 * Drag-and-drop (or click to choose) field for a game logo. Validates type/size, previews the
 * file, and warns if it is under 256×256 px or not roughly square.
 */
export function GameLogoDropzoneField({ value, file, error, onChange, onRemove }: GameLogoDropzoneFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState('')
  const [localError, setLocalError] = useState('')
  const [warning, setWarning] = useState('')
  const border = useColorModeValue('gray.300', 'whiteAlpha.300')
  const source = preview || value

  const selectFile = (nextFile: File | null) => {
    if (!nextFile) return
    const validation = validateUploadedImage(nextFile, 10)
    if (!validation.valid) {
      setLocalError(validation.message)
      return
    }
    setLocalError('')
    setWarning('')
    const objectUrl = URL.createObjectURL(nextFile)
    setPreview(objectUrl)
    onChange(nextFile)
    const image = new window.Image()
    image.onload = () => {
      if (image.width < 256 || image.height < 256) setWarning('This logo is smaller than 256x256 px.')
      else if (Math.abs(image.width / image.height - 1) > 0.2) setWarning('This logo is not roughly square.')
      URL.revokeObjectURL(objectUrl)
    }
    image.src = objectUrl
  }

  return (
    <FormControl isInvalid={Boolean(error || localError)} isRequired>
      <FormLabel>Game logo</FormLabel>
      <Box border="1px dashed" borderColor={border} p={4} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0] ?? null) }}>
        <Stack spacing={3} align="center">
          {source ? <Image src={source} alt="Game logo preview" boxSize="120px" objectFit="contain" /> : <Text color="gray.500">Drop a logo here or choose a file.</Text>}
          <Input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" display="none" onChange={(event) => selectFile(event.target.files?.[0] ?? null)} />
          <Stack direction="row">
            <Button variant="outline" onClick={() => inputRef.current?.click()}>{source ? 'Replace' : 'Upload logo'}</Button>
            {source ? <Button variant="ghost" onClick={() => { setPreview(''); onRemove() }}>Remove</Button> : null}
          </Stack>
        </Stack>
      </Box>
      <FormHelperText>Square logo, transparent PNG or WebP, at least 512x512 px, light colors work best on the dark theme.</FormHelperText>
      {warning ? <Alert status="warning" mt={2}>{warning}</Alert> : null}
      <FormErrorMessage>{error || localError}</FormErrorMessage>
      {file ? <Text fontSize="sm" color="gray.500" mt={2}>{file.name}</Text> : null}
    </FormControl>
  )
}