import PublishItemForm from '../components/PublishItemForm';

const Publish = () => {
  return (
    <div className="min-h-screen px-32 bg-gray-100 py-6 flex flex-col justify-center">
      <div className="relative py-3 max-w-lg mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          
        </div>
        <div className="relative flex justify-center text-lg font-bold text-gray-900">
          Publish New Item
        </div>
      </div>
      <PublishItemForm />
    </div>
  );
};

export default Publish;