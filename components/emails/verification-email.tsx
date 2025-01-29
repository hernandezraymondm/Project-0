import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Img,
  Section,
  Button,
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
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://res.cloudinary.com/ddzz4trls/image/upload/v1738166116/unknown_logo-removebg-preview_pdxv5y.png"
            width="200"
            height="70"
            alt="Logo"
            style={logo}
          />
          <Section>
            <Text style={heading}>Hey, Welcome!</Text>
            <Text style={text}>
              Thanks for registering an account with us. We are excited to have
              you on board. We are committed to providing you with the best
              experience possible.
            </Text>
            <Text style={text}>
              Before we get started, we&apos;ll need to verify your email.
            </Text>

            <Text style={text}>Please click the button below to verify:</Text>
            <Button style={button} href={verificationUrl}>
              Verify email address
            </Button>
            <Text style={text}>
              If the button above doesn&apos;t work, paste this link into your
              browser:
              <Link style={anchor} href={verificationUrl}>
                {verificationUrl}
              </Link>
            </Text>
            <Text style={footer}>
              If you didn&apos;t register an account with this app or if
              something is wrong, feel free to contact our support team
              we&apos;re here to help!
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

VerificationEmail.PreviewProps = {
  verificationUrl:
    "https://example.com/auth/email-verification/a3f8b58a-7d3a-49b2-ba3b-0d5211bba0ad",
} as VerificationEmailProps;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const button = {
  backgroundColor: "#181f31",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "280px",
  padding: "14px 0",
  margin: "20px auto 14px",
  verticalAlign: "middle",
};

const anchor = {
  textDecoration: "underline",
};

const logo = {
  margin: "0 auto",
  marginBottom: "10px",
};

const heading = {
  fontSize: "23px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "600",
  color: "#404040",
  lineHeight: "26px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const footer = {
  ...text,
  color: "#ababab",
  marginTop: "14px",
  marginBottom: "16px",
};
