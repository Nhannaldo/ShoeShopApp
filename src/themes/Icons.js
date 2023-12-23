import React from "react";
import account from '../assets/svgs/account.svg'
import account_focus from '../assets/svgs/account_focus.svg'
import home from '../assets/svgs/home.svg'
import home_focus from '../assets/svgs/home_focus.svg'
import order from '../assets/svgs/order.svg'
import order_focus from '../assets/svgs/order_focus.svg'
import product from '../assets/svgs/product.svg'
import product_focus from '../assets/svgs/product_focus.svg'
import cart from '../assets/svgs/cart.svg'
import search from '../assets/svgs/search.svg'
import cart_black from '../assets/svgs/cart_black.svg'
import search_gray from '../assets/svgs/search_gray.svg'
import back from '../assets/svgs/back.svg'
import ic_heart from '../assets/svgs/ic_heart.svg'
import ic_share from '../assets/svgs/ic_share.svg'
import star from '../assets/svgs/star.svg'
import next from '../assets/svgs/next.svg'
import plane from '../assets/svgs/plane.svg'
import ticket from '../assets/svgs/ticket.svg'
import badge from '../assets/svgs/badge.svg'
import checked from '../assets/svgs/checked.svg'
import checked1 from '../assets/svgs/checked1.svg'

const SVGs = {
    account,
    account_focus,
    home,
    home_focus,
    order,
    order_focus,
    product,
    product_focus,
    cart,
    search,
    cart_black,
    search_gray,
    back,
    ic_heart,
    ic_share,
    star,
    next,
    plane,
    ticket,
    badge,
    checked,
    checked1
}

export default {
    Icons: ({ name = "", height, width }) => {
        if (name in SVGs) {
            const IconComponent = SVGs[name];
            return <IconComponent height={height} width={width} />;
        } else {
            return null;
        }
    }
}