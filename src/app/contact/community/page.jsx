import CommunityPage from './component/CommunityPage'

export default async function Page({ searchParams }) {
  const { communityId } = await searchParams

  return <CommunityPage communityId={communityId} />
}
