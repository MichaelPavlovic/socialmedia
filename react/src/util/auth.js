//send user to login page if they try to access a protected page while not authenticated
export const pushToLogin = (history) => {
  const authToken = localStorage.getItem('AuthToken');
  if(authToken === null){
      history.push('/login');
  }
}