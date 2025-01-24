import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Preview,
} from "@react-email/components";

interface VerificationEmailProps {
  verificationUrl: string;
}

export default function VerificationEmail({
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
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
            Thank you for registering. Please click the link below to verify
            your email address:
          </Text>
          <Link
            href={verificationUrl}
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            Verify Email
          </Link>
          <Text>
            If you&apos;re having trouble clicking the button, copy and paste
            the URL below into your web browser:
          </Text>
          <Text>{verificationUrl}</Text>
        </Container>
      </Body>
    </Html>
  );
}
