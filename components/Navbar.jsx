import React from 'react';
import { AiOutlineShopping } from 'react-icons/ai';
import Link from 'next/link';
import { useStateContext } from '../context/StateContext';
import Card from './Card';
const Navbar = () => {
  const {showCard, setShowCard , totalQuantities} = useStateContext();

  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/">Gvorax Headphones</Link>
      </p>

      <button type="button" onClick={()=>setShowCard(true)}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>

      {showCard && <Card />}
    </div>
  );
};

export default Navbar;
