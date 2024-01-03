import { Link, Typography } from "@mui/material";

export default function PaymentSuccess() {
  return (
    <>
      <Typography>
        Payment Success
        <Link
          href={`http://ec2-3-15-172-164.us-east-2.compute.amazonaws.com/user/my-courses`}
        >
          Go to My Courses
        </Link>
      </Typography>
    </>
  );
}