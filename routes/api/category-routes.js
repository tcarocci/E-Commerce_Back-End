const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// GET - Displays all categories
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// POST - Creates a new category
router.post('/', async (req, res) => {
  console.log('Request body:', req.body);
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// PUT - Updates a category by its id
router.put('/:id', async (req, res) => {
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Category updated successfully!' })
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE - The category by its id
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  try {
    // First, update or delete all products associated with this category
    await Product.update(
      { category_id: null },
      { where: { category_id: id } }
    );

    // Then delete the category
    const categoryData = await Category.destroy({
      where: {
        id: id,
      },
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
module.exports = router;
