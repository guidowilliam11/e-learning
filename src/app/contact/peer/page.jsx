import PeerPage from './component/PeerPage'

export default async function Page({ searchParams }) {
  const { email } = await searchParams
  return <PeerPage email={email} />
}
