import SavingsGoals from './SavingsGoals';

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-sm border border-white/20 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Your Savings Goals</h2>
        <SavingsGoals />
      </div>
    </div>
  );
}