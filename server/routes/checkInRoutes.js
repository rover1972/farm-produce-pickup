router.post('/check-in', async (req, res) => {
  try {
    console.log('\n=== Check-in Request Received ===');
    console.log('Request body:', req.body);
    const checkIn = await sheetService.createCheckIn(req.body);
    res.json(checkIn);
  } catch (error) {
    console.error('Error in check-in route:', error);
    res.status(400).json({ error: error.message });
  }
}); 