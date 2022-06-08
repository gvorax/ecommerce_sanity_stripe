import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => { 
  const [showCard, setShowCard] = useState(false);
  const [cardItems, setCardItems] = useState([]);
  const [totalPrices, setTotalPrices] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);
  let foundProduct;
  let index;

  const onAdd = (product, quantity) => {
    const checkProductInCart = cardItems.find((item) => item._id === product._id);
    
    setTotalPrices((prevTotalPrice) => prevTotalPrice + product.price * quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
    
    if(checkProductInCart) {
      const updatedCartItems = cardItems.map((cartProduct) => {
        if(cartProduct._id === product._id) return {
          ...cartProduct,
          quantity: cartProduct.quantity + quantity
        }
      })

      setCardItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      
      setCardItems([...cardItems, { ...product }]);
    }

    toast.success(`${qty} ${product.name} added to the cart.`);
  } 


  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    });
  };

  const onRemove =(product)=>{
    foundProduct = cardItems.find(item => item._id === product._id);
    const newCardItems = cardItems.filter(item =>item._id !== product._id);

    setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
    setTotalPrices(prevTotalPrices => prevTotalPrices - foundProduct.price * foundProduct.quantity);
    setCardItems(newCardItems);
  }

  const toggleCartItemQuantity = (id, value) =>{
    foundProduct = cardItems.find((item) => item._id === id);
    index = cardItems.findIndex(item => item._id === id);

    const newCardItems = cardItems.filter((item) => item._id !==id);

    if(value === 'inc'){
      setCardItems([...newCardItems,{...foundProduct,quantity:foundProduct.quantity +1}]);
      setTotalPrices((prevTotalPrice) => prevTotalPrice + foundProduct.price)
      setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
    }else if(value ==='dec'){
      if (foundProduct.quantity > 1) {
        setCardItems([...newCardItems, { ...foundProduct, quantity: foundProduct.quantity - 1 } ]);
        setTotalPrices((prevTotalPrice) => prevTotalPrice - foundProduct.price)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
      }
    }
  }

  return (
    <Context.Provider
      value={{
        showCard,
        setShowCard,
        cardItems,
        setCardItems,
        totalQuantities,
        setTotalQuantities,
        totalPrices,
        setTotalPrices,
        qty,
        setQty,
        incQty,
        decQty,
        onAdd,
        onRemove,
        toggleCartItemQuantity
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
