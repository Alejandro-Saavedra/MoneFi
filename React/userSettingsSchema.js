import * as Yup from "yup";

export const settingsPasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required("Current password is required"),
    newPassword: Yup.string()
        .required("Please enter a new password")
        .max(100, "Password cannot have more than 100 characters")
        .matches(
            "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
    confirmPassword: Yup.string()
        .required("Please confirm your new password")
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

export const settingsEmailSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid Email")
        .required("Please enter a valid email")
        .max(255, "Email cannot have more than 255 characters"),
        currentPassword: Yup.string()
        .required("Current password is required"),
});

