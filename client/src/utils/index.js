export const checkUserToken = () => {
    console.log("Cookies in browser:", document.cookie); // ✅ Check if cookies are present
  
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('jwt='));
  
    console.log("User Token Found:", token); // ✅ Log what is found
  
    return !!token;
  };
  
  export const checkShopToken = () => {
    console.log("Cookies in browser:", document.cookie); // ✅ Check if cookies are present
  
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('shop_jwt='));
  
    console.log("Shop Token Found:", token); // ✅ Log what is found
  
    return !!token;
  };
  