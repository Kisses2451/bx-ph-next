import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import { FeedItemTypeBadge } from '../atoms/FeedItemTypeBadge'
import type { HomeFeedItem } from '../../types/homeFeed'

/** A compact row in the home page feed (every item after the featured one). */
export function FeedListRow({ item }: { item: HomeFeedItem }) {
  const muted = useColorModeValue('var(--text-muted)', 'var(--text-muted)')
  return (
    <Box className="editorial-feed__row">
      <FeedItemTypeBadge type={item.type} />
      <Text className="editorial-feed__date">{item.date ? new Date(item.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Latest'}</Text>
      <Box><Heading className="editorial-card__title" as="h4" size="md">{item.title}</Heading>{item.type === 'event' && item.location ? <Text className="editorial-card__body" color={muted}>{item.location}</Text> : null}{item.description ? <Text className="editorial-card__body" color={muted} noOfLines={2}>{item.description}</Text> : null}</Box>
    </Box>
  )
}
