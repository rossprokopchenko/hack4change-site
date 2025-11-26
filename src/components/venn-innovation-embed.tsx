import Box from "@mui/material/Box";

export default function VennInnovationEmbed() {
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 350, sm: 450, md: 500 },
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20896.173087385712!2d-64.81077821988478!3d46.084185577913615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ca0b9396aa0ce8d%3A0x2ab3f8a8d17c244a!2sVenn%20Innovation!5e0!3m2!1sen!2sca!4v1764171525796!5m2!1sen!2sca"
        style={{ border: 0, width: "100%", height: "100%" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </Box>
  );
}
