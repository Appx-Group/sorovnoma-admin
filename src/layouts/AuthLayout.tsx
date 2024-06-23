import LoginForm from "@/components/forms/loginForm";

const AuthLayout = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white w-80 min-h-80 p-10  shadow-sm rounded-md border border-primary border-opacity-10 flex flex-col justify-center gap-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default AuthLayout;
