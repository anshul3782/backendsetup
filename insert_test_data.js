const testData = [
  { "phone_number": "1111111111", "steps": 1000 },  // apple
  { "phone_number": "2222222222", "steps": 2000 },  // ball
  { "phone_number": "3333333333", "steps": 3000 },
  { "phone_number": "4444444444", "steps": 4000 },
  { "phone_number": "5555555555", "steps": 5000 },
  { "phone_number": "6666666666", "steps": 6000 },
  { "phone_number": "7777777777", "steps": 7000 },
  { "phone_number": "8888888888", "steps": 8000 },
  { "phone_number": "9999999999", "steps": 9000 },
  { "phone_number": "0000000000", "steps": 10000 }
];

async function insertTestData() {
  console.log('🚀 Inserting test data...');
  
  for (let i = 0; i < testData.length; i++) {
    const record = testData[i];
    
    try {
      const response = await fetch('http://localhost:3000/api/live-steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Record ${i + 1}: ${record.phone_number} - ${record.steps} steps (ID: ${result.id})`);
      } else {
        console.log(`❌ Failed to insert record ${i + 1}: ${record.phone_number}`);
      }
    } catch (error) {
      console.log(`❌ Error inserting record ${i + 1}: ${error.message}`);
    }
  }
  
  console.log('🎉 Test data insertion complete!');
}

insertTestData(); 