import { useState, useEffect, useCallback } from 'react';
import api from './api';

export default function SavingsGoals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newGoal, setNewGoal] = useState({
        title: '',
        targetAmount: '',
        targetDate: '',
    });

    const [contribution, setContribution] = useState({});

    const fetchGoals = useCallback(async () => {
        try {
            const response = await api.get('/savings-goals');
            setGoals(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching goals", error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const handleCreateGoal = async (e) => {
        e.preventDefault();
        try {
            await api.post('/savings-goals', {
                ...newGoal,
                targetAmount: Number(newGoal.targetAmount),
            });
            setNewGoal({ title: '', targetAmount: '', targetDate: '' });
            fetchGoals();
        } catch (error) {
            console.error("Error creating goal", error);
        }
    };

    const handleContribute = async (goalId) => {
        const amount = contribution[goalId];
        if (!amount || amount <= 0) return;

        try {
            await api.post(`/savings-goals/${goalId}/contribute`, {
                amount: Number(amount),
            });
            setContribution({ ...contribution, [goalId]: '' });
            fetchGoals();
        } catch (error) {
            console.error("Error contributing", error);
        }
    };

    if (loading) return <div className="text-center p-4 text-gray-600 dark:text-gray-400">Loading goals...</div>;

    return (
        <div className="space-y-6">

            {/* Create Goal Form */}
            <form onSubmit={handleCreateGoal} className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl border border-white dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-300">
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Goal Title</label>
                        <input
                            type="text"
                            required
                            value={newGoal.title}
                            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                            className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" 
                            placeholder="e.g. Buy a Laptop"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Target Amount (Rs.)</label>
                        <input
                            type="number"
                            required
                            value={newGoal.targetAmount}
                            onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                            className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl w-40 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            placeholder="150000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-1">Target Date</label>
                        <input
                            type="date"
                            required
                            value={newGoal.targetDate}
                            onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                            className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                    </div>
                    <button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-green-500/30 transition-all">
                        Create Goal
                    </button>
                </div>
            </form>

            {/* Goals List */}
            <div className="space-y-4 mt-6">
                {goals.length === 0 && <p className="text-gray-500 dark:text-gray-400">No savings goals yet. Create one above!</p>}

                {goals.map((goal) => {
                    const percentage = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100);
                    const isCompleted = goal.savedAmount >= goal.targetAmount;

                    return (
                        <div key={goal._id} className="bg-white/90 dark:bg-gray-800/40 p-5 rounded-2xl border border-white dark:border-gray-700/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-gray-200">{goal.title}</h4>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-200">
                                        Rs. {goal.savedAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
                                <div
                                    className={`h-3 rounded-full ${isCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-purple-600'} transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{percentage}% Complete</span>

                                {!isCompleted && (
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            value={contribution[goal._id] || ''}
                                            onChange={(e) => setContribution({ ...contribution, [goal._id]: e.target.value })}
                                            className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2 rounded-lg w-28 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                        />
                                        <button
                                            onClick={() => handleContribute(goal._id)}
                                            className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
                                        >
                                            Add Funds
                                        </button>
                                    </div>
                                )}
                                {isCompleted && (
                                    <span className="text-green-600 dark:text-green-400 font-bold text-sm">🎉 Goal Achieved!</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}