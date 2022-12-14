import React, { useCallback } from "react";

import annimation from "../../assets/94439-abstract.json";
import Lottie from "react-lottie";
import { Container, CreateRoom, MainContent } from "./styles";

import { Form } from "@unform/web";
import { useRef } from "react";
import { FormHandles } from "@unform/core";
import Input from "../../components/Input";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import * as Yup from "yup";
import getValidationErrors from "../../utils/getValidationErrors";
import { api } from "../../services/api";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";

import { Spinner } from "react-activity";
import { toast } from "react-toastify";

interface SignInFormData {
  username: string;
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const options = {
    loop: true,
    autoplay: true,
    animationData: annimation,
  };

  const history = useHistory();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      setIsLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          username: Yup.string().required("User Name Mandatory"),
          email: Yup.string()
            .email("Enter Proper Email Id!")
            .required("Email mandatory"),
          password: Yup.string().required("Password Mandatory"),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post("/user", data);
        toast("Successfully Registered!", { type: "success" });
        setTimeout(() => {
          history.push("/");
        }, 5000);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const erros = getValidationErrors(error);

          formRef.current?.setErrors(erros);

          return;
        }
        toast(String(error), { type: "error" });
      } finally {
        setIsLoading(false);
      }
    },
    [history]
  );

  return (
    <Container>
      <aside>
        <MainContent>
          <Form ref={formRef} onSubmit={handleSubmit} style={{ width: "100%" }}>
            <h1>Registration</h1>
            <Input
              name="username"
              icon={FiUser}
              type="text"
              placeholder="User Name"
            />
            <Input
              name="email"
              icon={FiMail}
              type="text"
              placeholder="E-mail"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="password"
            />
            <CreateRoom type="submit">
              {isLoading ? (
                <Spinner color="rgba(178,105,250,1)" />
              ) : (
                "Register"
              )}
            </CreateRoom>
            <Link to="/">Already have account</Link>
          </Form>
        </MainContent>
      </aside>
      <main>
        <Lottie width={"65%"} height={"65%"} options={options} />
      </main>
    </Container>
  );
};

export default SignIn;
