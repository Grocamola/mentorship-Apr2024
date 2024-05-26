import PocketBase from 'pocketbase';

const getOnlineUsers = async () => {
    const pb = new PocketBase('https://jenna-tictactoe.pockethost.io');
    try {
        const response = await pb.collection('users').getFullList({
            sort: '-created',
        });
        console.log(response);
        return response;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export default getOnlineUsers;