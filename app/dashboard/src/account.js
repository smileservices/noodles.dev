import {getCsrfToken} from './utils';

export function logout() {
    fetch(ROUTES.account.logout,
        {
            method: "POST",
            headers: {
                'X-CSRFToken': getCsrfToken()
            }
        }).then(res=>{
            console.log(res);
            if (res.status === 200) {
                if (res.redirected) {
                    window.location = res.url;
                }
            } else {
                console.error('Cannot logout!')
                console.error(res);
            }
    })
}