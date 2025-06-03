async function scanFridgeAndGetRecipes() {
  const imageInput = document.getElementById('fridgeImage');
  const recipeOutput = document.getElementById('recipeResults');

  if (!imageInput.files || imageInput.files.length === 0) {
      recipeOutput.textContent = 'Please select an image.';
      return;
  }

  const imageFile = imageInput.files[0];
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
      recipeOutput.textContent = 'Scanning fridge...';
      const imageResponse = await fetch('http://localhost:3000/api/process-image', {
          method: 'POST',
          body: formData,
      });

      if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          throw new Error(`Image processing failed with status ${imageResponse.status}: ${errorText}`);
      }

      const ingredientsData = await imageResponse.json();
      const ingredients = ingredientsData.ingredients;
      recipeOutput.textContent = `Ingredients found: ${ingredients.join(', ')}. Generating recipes...`;

      const recipeResponse = await fetch('http://localhost:3000/api/generate-recipes', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ingredients: ingredients }),
      });

      if (!recipeResponse.ok) {
          const errorText = await recipeResponse.text();
          throw new Error(`Recipe generation failed with status ${recipeResponse.status}: ${errorText}`);
      }

      const recipes = await recipeResponse.json();
      recipeOutput.innerHTML = '<h3>Recipe Ideas:</h3>';
      recipes.forEach(recipe => {
          const recipeDiv = document.createElement('div');
          recipeDiv.textContent = recipe;
          recipeOutput.appendChild(recipeDiv);
      });

  } catch (error) {
      console.error('Error:', error);
      recipeOutput.textContent = `An error occurred ${error.message}`;
  }
}