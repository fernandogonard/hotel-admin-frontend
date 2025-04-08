const ErrorMessage = ({ message }) => (
  <div className="text-center text-red-600 mt-10">
    <p className="text-lg font-semibold">⚠️ Error:</p>
    <p>{message}</p>
  </div>
);

export default ErrorMessage;
