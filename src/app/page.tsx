import { HomePage } from '../components/pages/HomePage'
import { getHomePageData } from '../server/publicData'

export const revalidate = 60

export default async function Page() {
  const data = await getHomePageData()
  return <HomePage initialUpdates={data.updates} initialGames={data.games} initialEvents={data.events} />
}
