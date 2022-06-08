import React, { useRef } from 'react';
import Link from 'next/link';
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';
import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/sanity';
import getStripe from '../lib/getStripe';

const Card = () => {
  const cardRef = useRef();
  const {
    totalPrices,
    totalQuantities,
    cardItems,
    setShowCard,
    toggleCartItemQuantity,
    onRemove,
  } = useStateContext();

  const handleCheckOut = async ()=>{
    const stripe = await getStripe();

    const response = await fetch('/api/stripe',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cardItems)
    })


    if(response.statusCode === 500) return

    const data = await response.json();

    toast.loading('Redirecting...');

    stripe.redirectToCheckout({ sessionId: data.id });
  }
  return (
    <div className="cart-wrapper" ref={cardRef}>
      <div className="cart-container">
        <button
          type="button"
          onClick={() => setShowCard(false)}
          className="cart-heading"
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>

        {cardItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button type="button" className="btn" onClick={()=>setShowCard(false)}>
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {cardItems.length >= 1 &&
            cardItems.map((cardItem) => (
              <div className="product" key={cardItem._id}>
                <img
                  src={urlFor(cardItem?.image[0])}
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{cardItem.name}</h5>
                    <h4>{cardItem.price}</h4>
                  </div>

                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() =>
                            toggleCartItemQuantity(cardItem._id, 'dec')
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num" onClick="">
                          {cardItem.quantity}
                        </span>
                        <span
                          className="plus"
                          onClick={() =>
                            toggleCartItemQuantity(cardItem._id, 'inc')
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => onRemove(cardItem)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cardItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${totalPrices}</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={handleCheckOut}>
                Pay with Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
