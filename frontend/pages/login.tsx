import { useState } from "react";
import { useRouter } from "next/router"
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button, Input, Typography, CircularProgress } from "@mui/material";
import styles from "../styles/Home.module.css";



const LoginPage = () => {
    const router = useRouter()

    const { register, handleSubmit ,formState: { errors, touchedFields }} = useForm();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, data);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                await router.push('/home');
            } else {
            alert("Bad credentials")
            }
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.main}>
            <h1>Login</h1>
            <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={styles.input}
                    error={(errors.email && touchedFields.email) || !!error}
                    onFocus={() => {
                        setError("");
                    }}
                    {...register( "email", { required: true } )}
                />
                {errors.email && (
                    <Typography variant="body2" color="error">
                        Email is required.
                    </Typography>
                )}
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className={styles.input}
                    onFocus={() => {
                        setError("");
                    }}
                    error={(!!errors.password && touchedFields.password) || !!error}
                    {...register( "password", { required: true} )}
                />
                {errors.password && (
                    <Typography variant="body2" color="error">
                        Password is required.
                    </Typography>
                )}
                {error && (
                    <Typography variant="body2" color="error">
                        {error}
                    </Typography>
                )}
                <Button disabled={loading} type="submit">
                    {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>
            </form>
        </div>
    );
};

export default LoginPage;
