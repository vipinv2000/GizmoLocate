import { Outlet,Navigate, useNavigate } from "react-router-dom";
import { checkShopToken } from "../../utils";



const ShopPrivateRoute=()=>{
  
    if(checkShopToken()){
        return <Outlet/>
    }else{
       return <Navigate to="/shop/login"/>
    }


}

export default ShopPrivateRoute