import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery } from "@apollo/client/react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FindAvailableProductForm = () => {
  const [type, setType] = useState('gadget');
  const [pageSize, setPageSize] = useState('');
  const [products, setProducts] = useState(null);
  
  const FIND_AVAILABLE_PRODUCTS = gql`
    query FindAvailableProducts($type: ProductType!, $pageSize: Int!) {
      findAvailableProducts(type: $type, pageSize: $pageSize) {
        id
        name
        inventory
        type
      }
    }
  `;

  const [findAvailableProducts, { loading, data, error }] = useLazyQuery(FIND_AVAILABLE_PRODUCTS, {fetchPolicy: 'network-only'});

  useEffect(() => {
    const products = data?.findAvailableProducts || [];
    setProducts(products);
  }, [data]);

  useEffect(() => {
    if (!error) return;
    setProducts(null);
    toast.error('Encountered error executing the findAvailableProducts query');
    return () => toast.dismiss();
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(pageSize) || pageSize <= 0) {
      toast.dismiss();
      toast.error('Page size must be a positive number');
      return;
    }
    
    findAvailableProducts({
      variables: { type, pageSize: parseInt(pageSize, 10) },
      context: {
        headers: {
          "X-region": "north-west"
        }
      }
    });
  };

  const isProductsValid = () => {
    if(!products || products.every(product => !product)) return false;
    return true;
  }

  return (
    <div className="max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-4 text-2xl font-bold">Find Available Products</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            data-testid="type"
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
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="pageSize">
            Page Size
          </label>
          <input
            type="number"
            id="pageSize"
            data-testid="pageSize"
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            data-testid="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading && 'opacity-50 cursor-not-allowed'}`}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {loading && !isProductsValid() && 
          <div
            className="p-4 mt-8 border rounded-lg shadow-sm bg-gray-50"
            data-testid="product"
          >
            <p>No products found</p>
          </div>
      }
      {loading && isProductsValid() && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold">Available Products</h2>
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => {
              if(!product) return <></>;
              return (
                <div
                  key={product.id}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50"
                  data-testid="product"
                >
                  <p><strong>ID:</strong> {product.id}</p>
                  <p><strong>Name:</strong> {product.name}</p>
                  <p><strong>Inventory:</strong> {product.inventory}</p>
                  <p><strong>Type:</strong> {product.type}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindAvailableProductForm;

