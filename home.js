import { timeline } from 'wix-animations';

$w.onReady(function () {
    // Function to fetch HTML content from external URL
    function fetchExternalHTML(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch content from ${url}`);
                }
                return response.text();
            })
            .catch(error => {
                console.error(error);
                throw new Error(`Failed to fetch content from ${url}`);
            });
    }

    // Function to extract desired data from HTML content
	function extractDataFromHTML(html) {
		const data = [];
		// Find the index of the start of the table body
		const startIndex = html.indexOf('<tbody>');
		// Find the index of the end of the table body
		const endIndex = html.indexOf('</tbody>', startIndex);
		// Extract the table body content
		const tableBody = html.substring(startIndex, endIndex);
		// Split the table body content into rows
		const rows = tableBody.split('</tr>');
		// Iterate over each row
		rows.forEach(row => {
			// Extract the name and price data from the row
			const nameStartIndex = row.indexOf('<span class="maior">') + '<span class="maior">'.length;
			const nameEndIndex = row.indexOf('</span>', nameStartIndex);
			const name = row.substring(nameStartIndex, nameEndIndex);
			const priceStartIndex = row.indexOf('<span class="maior">', nameEndIndex) + '<span class="maior">'.length;
			const priceEndIndex = row.indexOf('</span>', priceStartIndex);
			const price = row.substring(priceStartIndex, priceEndIndex);
			// Add the extracted data to the result array
			data.push({ name, price });
		});
		const newData = {};
		for (let i = 0; i < 3; i++) {
			const item = data[i];
			let newName = '';
			switch (item.name) {
				case 'Soja Paranaguá':
					newName = 'Soya - DAP/FAS - Paranagua';
					break;
				case 'Açúcar - Santos':
					newName = 'Sugar (IMCUSA) - FOB Santos';
					break;
				case 'Café Arábica':
					newName = 'Coffee (Arabica) - Exworks SP/PR';
					break;
				default:
					newName = item.name;
			}
			newData[newName] = '$' + item.price;
		}
		return newData;
	}
    

    // Fetch HTML content from external URL and extract desired data
    fetchExternalHTML('https://www.cepea.esalq.usp.br/br/widgetproduto.js.php?fonte=arial&tamanho=10&largura=400px&corfundo=dbd6b2&cortexto=333333&corlinha=ede7bf&id_indicador%5B%5D=23&id_indicador%5B%5D=143&id_indicador%5B%5D=92')
        .then(html => {
            const data = extractDataFromHTML(html);
            console.log(data); // Display extracted data in console for testing
			// Function to handle text animation
			$w("#text19").text = `${Object.keys(data)[0]} : ${Object.values(data)[0]}`;
			$w("#text20").text = `${Object.keys(data)[1]} : ${Object.values(data)[1]}`;
			$w("#text21").text = `${Object.keys(data)[2]} : ${Object.values(data)[2]}`;
			$w("#text22").text = `${Object.keys(data)[0]} : ${Object.values(data)[0]}`;
			$w("#text23").text = `${Object.keys(data)[1]} : ${Object.values(data)[1]}`;
			$w("#text24").text = `${Object.keys(data)[2]} : ${Object.values(data)[2]}`;
			
			
			function animateText() {
				// Animate the text elements
				const revealTimeline = timeline()
					.add($w('#box4'), {duration: 18000, x: -1300, easing: 'easeInOutSine'})
					revealTimeline.play();
				revealTimeline.onComplete( () => {
					// handle timeline forwards completion
					revealTimeline.reverse();
					} );
			}

			// Call the animateText function initially and set it to repeat
			animateText();
			setInterval(animateText, 36000); 


        })
        .catch(error => {
            console.error(error);
            // Handle error
        });

});
