import React, { useState, useEffect } from "react";
import axios from "axios";
import withTheme from '../../hocs/withTheme';
import { useNavigate } from "react-router-dom";

interface Transaction {
  transaction_id: number;
  product: string;
  product_id: number;
  status: string;
  total_price: string;
}

interface OrderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Order: React.FC<OrderProps> = ({ isDarkMode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (userRole !== "seller") {
      navigate("/Unauthorized");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://vicious-damara-gentaproject-0a193137.koyeb.app/transaction/seller",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTransactions(response.data.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatCurrency = (amount: string) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });
    return formatter.format(Number(amount));
  };

  const updateTransactionStatus = async (
    transaction_id: number,
    product_id: number,
    status: string
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        "https://vicious-damara-gentaproject-0a193137.koyeb.app/transaction/seller",
        { transaction_id, product_id, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(`Transaction updated to "${status}"`);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} py-12`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Orders</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-[#40b446]">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Transaction ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Product ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Product</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Total Price</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.transaction_id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    {transaction.transaction_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    {transaction.product_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    {transaction.product}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 capitalize text-black">
                    {transaction.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    {formatCurrency(transaction.total_price)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    <button
                      className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
                      onClick={() =>
                        updateTransactionStatus(
                          transaction.transaction_id,
                          transaction.product_id,
                          "on_process"
                        )
                      }
                    >
                      On Process
                    </button>
                    <button
                      className="bg-green-500 text-white py-1 px-4 rounded"
                      onClick={() =>
                        updateTransactionStatus(
                          transaction.transaction_id,
                          transaction.product_id,
                          "on_delivery"
                        )
                      }
                    >
                      On Delivery
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withTheme(Order);