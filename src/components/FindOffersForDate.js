import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery } from "@apollo/client/react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FindOffersForDate = () => {
  const [date, setDate] = useState('');
  const [offers, setOffers] = useState(null);

  const FIND_OFFERS_FOR_DATE = gql`
    query {
      findOffersForDate(date: "${date}") {
        offerCode
        validUntil
      }
    }
  `;

  const [findOffersForDate, { loading, data, error }] = useLazyQuery(FIND_OFFERS_FOR_DATE, {fetchPolicy: 'network-only'});

  useEffect(() => {
    const offers = data?.findOffersForDate || [];
    setOffers(offers);
  }, [data]);

  useEffect(() => {
    if (!error) return;
    setOffers(null);
    toast.error('Encountered error executing the findOffersForDate query');
    return () => toast.dismiss();
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Date.parse(date)) {
      toast.dismiss();
      toast.error('Please enter a valid date');
      return;
    }
    
    await findOffersForDate({ variables: { date } });
  };

  return (
    <div className="max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-4 text-2xl font-bold">Find offers valid until a certain date</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            data-testid="date"
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
      {offers && offers.map((offer, index) => {
        return (
          <div key={index} className="mt-8">
            <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <p><strong>Offer code:</strong> {offer.offerCode}</p>
              <p><strong>Valid Until:</strong> {new Date(offer.validUntil).toLocaleDateString()}</p>
            </div>
          </div>
        );
      })
      }
    </div>
  );
};

export default FindOffersForDate;

