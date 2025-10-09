import OrderDetails from './OrderDetails';

export const generateMetadata = ({ params }: { params: { id: string } }) => {
  return {
    title: `Order ${params.id}`,
  };
};

const OrderDetailsPage = ({ params }: { params: { id: string } }) => {
  return (
    <OrderDetails
      orderId={params.id} // PayPal prop remove kar diya
    />
  );
};

export default OrderDetailsPage;
