import { Metadata } from 'next';
import React from 'react';

import MyOrders from './MyOrders';

export const metadata: Metadata = {
  title: 'Order History',
};

const MyOrderPage = () => {
  return (
    <div>
     
      <MyOrders />
    </div>
  );
};

export default MyOrderPage;
