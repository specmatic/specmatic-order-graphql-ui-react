import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery } from "@apollo/client/react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FIND_OFFERS_AND_PRODUCTS = gql`
  query FindOffersAndProducts($date: String!, $type: ProductType!, $pageSize: Int!) {
    findOffersForDate(date: $date) {
      offerCode
      validUntil
    }
    findAvailableProducts(type: $type, pageSize: $pageSize) {
      id
      name
      inventory
      type
    }
  }
`;

const FindOffersAndProducts = () => {
  const [date, setDate] = useState('');
  const [type, setType] = useState('gadget');
  const [pageSize, setPageSize] = useState('');
  const [offers, setOffers] = useState(null);
  const [products, setProducts] = useState(null);
  const [queriesExecuted, setQueriesExecuted] = useState(false);

  const [fetchData, { loading, data, error }] = useLazyQuery(FIND_OFFERS_AND_PRODUCTS, {fetchPolicy: 'network-only'});

  useEffect(() => {
    if (!data) return;
    const offersData = data.findOffersForDate || null;
    const productsData = data.findAvailableProducts || null;
    setOffers(offersData);
    setProducts(productsData);
  }, [data]);

  useEffect(() => {
    if (!error) return;
    setOffers(null);
    setProducts(null);
    toast.error('Encountered error executing the findAvailableProducts query');
    return () => toast.dismiss();
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!Date.parse(date)) {
      toast.error('Please enter a valid date');
      return;
    }
    if (isNaN(pageSize) || pageSize <= 0) {
      toast.error('Page size must be a positive number');
      return;
    }

    setQueriesExecuted(true);

    fetchData({
      variables: {
        date: date,
        type,
        pageSize: parseInt(pageSize, 10),
      },
      context: {
        headers: {
          "X-region": "north-west"
        }
      }
    });
  };

  const isProductsValid = () => products && products.length > 0;
  const isOffersValid = () => offers && offers.length > 0;

  return (
    <div className="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-4 text-2xl font-bold">Find Offers and Products</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              data-testid="multi-date"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="type">
              Product Type
            </label>
            <select
              id="type"
              data-testid="multi-type"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="gadget">Gadget</option>
              <option value="book">Book</option>
              <option value="food">Food</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="pageSize">
              Page Size
            </label>
            <input
              type="number"
              id="pageSize"
              data-testid="multi-pageSize"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            data-testid="multi-submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {queriesExecuted && (
        <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-bold">Offers</h2>
            {isOffersValid() ? (
              offers.map((offer) => (
                <div key={offer.offerCode} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  <p><strong>Offer Code:</strong> {offer.offerCode}</p>
                  <p><strong>Valid Until:</strong> {new Date(offer.validUntil).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No offers found</p>
            )}
          </div>
          <div>
            <h2 className="mb-4 text-xl font-bold">Products</h2>
            {isProductsValid() ? (
              products.map((product) => (
                <div key={product.id} className="p-4 border rounded-lg shadow-sm bg-gray-50" data-testid="multi-product">
                  <p><strong>ID:</strong> {product.id}</p>
                  <p><strong>Name:</strong> {product.name}</p>
                  <p><strong>Inventory:</strong> {product.inventory}</p>
                  <p><strong>Type:</strong> {product.type}</p>
                </div>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindOffersAndProducts;

