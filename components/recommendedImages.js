// RecommendedImages.js
import React, { useContext } from 'react';
import { ScoreContext } from './components/scoreContext';
import { categoriesData } from './components/categoriesData'; // make sure the path is correct

const RecommendedImages = () => {
  const { state } = useContext(ScoreContext);
  const { scores } = state;

  // Extract all images from categoriesData and sort them by score
  let allImages = [];
  categoriesData.forEach(category => {
    allImages = allImages.concat(category.images.map(image => ({ ...image, categoryName: category.title })));
  });

  const sortedImages = allImages.sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));

  return (
    <div>
      {sortedImages.map(image => (
        <div key={image.id}>
          <img src={image.src} alt={image.description} />
          <p>{image.description} - Category: {image.categoryName}</p>
        </div>
      ))}
    </div>
  );
};

export default RecommendedImages;
