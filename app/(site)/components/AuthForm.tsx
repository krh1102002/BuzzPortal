"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/Input/Input";
import Button from "@/app/components/Input/Button";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/users");
    }
  }, [session.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "LOGIN") {
      //next-auth sign in

      signIn("credentials", { ...data, redirect: false })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials");
          }
          if (callback?.ok && !callback.error) {
            toast.success("Logged in!");
            router.push("/users");
          }
        })
        .finally(() => setIsLoading(false));
    }

    if (variant === "REGISTER") {
      axios
        .post("api/register", data)
        .then(() => signIn("credentials", data))
        .catch(() => toast.error("something went wrong !"))
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, {
      redirect: false,
    }).then((callback) => {
      if (callback?.error) {
        toast.error("Invalid Credentials");
      }
      if (callback?.ok && !callback.error) {
        toast.success("Logged in");
      }
    });
  };

  return (
    <div
      className="mt-8 
      sm:mx-auto
      sm:w-full
      sm:max-w-md
  "
    >
      <div
        className="bg-white px-4
      shadow
      py-8
      sm:px-10
      sm:rounded-lg
      "
      >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="name"
              label="Name"
              register={register}
              errors={errors}
              disabled={isloading}
            />
          )}
          <Input
            id="email"
            label="Email Address"
            register={register}
            errors={errors}
            type="email"
            disabled={isloading}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isloading}
          />
          <div>
            <Button disabled={isloading} type="submit" fullWidth>
              {variant === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex mt-6 gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN"
              ? "New to BuzzPortal?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
