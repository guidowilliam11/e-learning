const epoch = new Date()

export const contactsMockData = [
    {
        id: crypto.randomUUID(),
        name: 'John',
        email: 'john@example.com',
        profilePicture: '',
        lastMessage: 'Lorem ipsum',
        lastMessageTime: new Date().setMinutes(epoch.getMinutes() - 1),
        unreadCount: '3'
    },
    {
        id: crypto.randomUUID(),
        name: 'Doe',
        email: 'doe@example.com',
        profilePicture: '',
        lastMessage: 'Lorem ipsum',
        lastMessageTime: new Date().setMinutes(epoch.getMinutes() - 10),
        unreadCount: '0'
    },
    {
        id: crypto.randomUUID(),
        name: 'Juno',
        email: 'juno@example.com',
        profilePicture: '',
        lastMessage: 'Lorem ipsum',
        lastMessageTime: new Date().setDate(epoch.getDate() - 1),
        unreadCount: ''
    },
    {
        id: crypto.randomUUID(),
        name: 'Juno',
        profilePicture: '',
        lastMessage: 'Lorem ipsum',
        lastMessageTime: new Date().setDate(epoch.getDate() - 1),
        unreadCount: ''
    },
    {
        id: crypto.randomUUID(),
        name: 'Juno',
        profilePicture: '',
        lastMessage: 'Lorem ipsum',
        lastMessageTime: new Date().setDate(epoch.getDate() - 1),
        unreadCount: ''
    },
    {
        id: crypto.randomUUID(),
        name: 'Juno',
        profilePicture: '',
        lastMessage: 'Lorem ipsum',
        lastMessageTime: new Date().setDate(epoch.getDate() - 1),
        unreadCount: ''
    }
]

export const communitiesMockData = [
    {
        id: crypto.randomUUID(),
        name: 'Biology Community',
        profilePicture: '',
        lastMessage: 'Lorem ipsum',
        lastMessageTime: new Date().setMinutes(epoch.getMinutes() - 1),
        unreadCount: '3'
    },
    {
        id: crypto.randomUUID(),
        name: 'Computer Science Community',
        profilePicture: '',
        lastMessage: 'Lorem ipsum',
        lastMessageTime: new Date().setMinutes(epoch.getMinutes() - 10),
        unreadCount: '0'
    },
    {
        id: crypto.randomUUID(),
        name: 'Physics Community',
        profilePicture: '',
        lastMessage: 'Lorem ipsum',
        lastMessageTime: new Date().setDate(epoch.getDate() - 1),
        unreadCount: ''
    },
]

export const conversationsMockData = new Map()

contactsMockData.forEach(contact => {
    const conversation = {}
    conversation.id = contact.id
    conversation.name = contact.name
    conversation.profilePicture = contact.profilePicture
    conversation.isCommunity = false
    const messages = []

    for (let i = 0; i < 10; i++) {
        const message = {}
        message.id = crypto.randomUUID()
        if (i % 2 === 0) {
            message.senderName = ""
        } else {
            message.senderName = contact.name
        }

        message.type = 'text'
        message.value = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti, provident!'
        message.time = new Date().setMinutes(epoch.getMinutes() - (60 - i))
        message.link = ''
        messages.push(message)
    }

    conversation.messages = messages
    conversationsMockData.set(conversation.id, conversation)
})
communitiesMockData.forEach(community => {
    const conversation = {}
    conversation.id = community.id
    conversation.name = community.name
    conversation.profilePicture = community.profilePicture
    conversation.isCommunity = true
    const messages = []

    for (let i = 0; i < 10; i++) {
        const message = {}
        message.id = crypto.randomUUID()
        if (i % 2 === 0) {
            message.senderName = ""
        } else {
            message.senderName = community.name
        }

        message.type = 'text'
        message.value = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti, provident!'
        message.time = new Date().setMinutes(epoch.getMinutes() - (60 - i))
        message.link = ''
        messages.push(message)
    }

    conversation.messages = messages
    conversationsMockData.set(conversation.id, conversation)
})