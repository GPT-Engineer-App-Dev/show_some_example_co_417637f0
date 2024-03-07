import React, { useState, useEffect } from "react";
import { Box, FormControl, FormLabel, Input, Button, Text, useToast, Image } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const exampleColors = ["#F0F8FF", "#FAEBD7", "#00FFFF", "#7FFFD4", "#F0FFFF"];

const Index = () => {
  const [exampleColorData, setExampleColorData] = useState([]);

  useEffect(() => {
    const fetchExampleColors = async () => {
      const colorsData = await Promise.all(
        exampleColors.map(async (hex) => {
          const response = await fetch(`https://api.color.pizza/v1/${hex.replace("#", "")}`);
          if (!response.ok) {
            return { hex, name: "Color name not found", swatchImg: null };
          }
          const data = await response.json();
          return data.colors[0];
        }),
      );
      setExampleColorData(colorsData);
    };

    fetchExampleColors();
  }, []);
  const [hexCode, setHexCode] = useState("");
  const [colorName, setColorName] = useState("");
  const [colorSwatch, setColorSwatch] = useState(null);
  const toast = useToast();

  const fetchColorName = async (hex) => {
    try {
      const response = await fetch(`https://api.color.pizza/v1/${hex}`);
      if (!response.ok) {
        throw new Error("Color not found");
      }
      const data = await response.json();
      if (data.colors && data.colors.length > 0) {
        setColorName(data.colors[0].name);
        setColorSwatch(data.colors[0].swatchImg.svg);
      } else {
        setColorName("Color name not found");
        setColorSwatch(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchColorName(hexCode.replace("#", ""));
  };

  return (
    <Box p={4}>
      <FormControl id="hex-color" as="form" onSubmit={handleSubmit}>
        <FormLabel>Enter HEX Color Code</FormLabel>
        <Input type="text" placeholder="e.g., #1a2b3c" value={hexCode} onChange={(e) => setHexCode(e.target.value)} />
        <Button leftIcon={<FaSearch />} mt={2} colorScheme="blue" type="submit">
          Translate Color
        </Button>
      </FormControl>
      <Box mt={4} mb={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Example Colors:
        </Text>
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4}>
          {exampleColorData.map((color, index) => (
            <Box key={index} p={3} bg={color.hex} borderRadius="md" boxShadow="base" textAlign="center">
              <Text fontSize="lg">{color.name}</Text>
              {color.swatchImg && <Box mt={2} dangerouslySetInnerHTML={{ __html: color.swatchImg.svg }} />}
            </Box>
          ))}
        </Box>
      </Box>
      {colorName && (
        <Box mt={4}>
          <Text fontSize="xl" fontWeight="bold">
            Color Name: {colorName}
          </Text>
          {colorSwatch && <Box mt={2} dangerouslySetInnerHTML={{ __html: colorSwatch }} />}
        </Box>
      )}
    </Box>
  );
};

export default Index;
