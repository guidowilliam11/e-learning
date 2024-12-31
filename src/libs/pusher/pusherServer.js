import Pusher from 'pusher'

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  secret: process.env.PUSHER_APP_SECRET,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  cluster: 'ap1',
})