import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Preview,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  resetUrl: string;
}

export default function ResetPasswordEmail({
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f4f4f4",
          padding: "20px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <Text>Hello,</Text>
          <Text>
            We received a request to reset your password. If you didn&apos;t
            make this request, you can ignore this email.
          </Text>
          <Text>To reset your password, click the link below:</Text>
          <Link
            href={resetUrl}
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            Reset Password
          </Link>
          <Text>This link will expire in 1 hour.</Text>
          <Text>
            If you&apos;re having trouble clicking the button, copy and paste
            the URL below into your web browser:
          </Text>
          <Text>{resetUrl}</Text>
        </Container>
      </Body>
    </Html>
  );
}
