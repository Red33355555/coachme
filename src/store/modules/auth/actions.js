export default {
    async authenticate(context, payload) {
        const url = payload.mode === 'login' ? 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyARMYO164LVIWq8Vo_GfKie2Qfhc9kGQho' :
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyARMYO164LVIWq8Vo_GfKie2Qfhc9kGQho';
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                returnSecureToken: true
            })
        });
        const responseData = await response.json();
        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to Authenticate.')
            throw error;
        }
        console.log(responseData);
        context.commit('setUser', {
            token: responseData.idToken,
            userId: responseData.localId,
            tokenExpiration: responseData.expiresIn
        });
    },
    logout(context) {
        context.commit('setUser', {
            token: null,
            userId: null,
            tokenExpiration: null
        });
    }
};