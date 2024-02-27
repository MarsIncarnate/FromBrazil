import { timeline } from 'wix-animations';
import wixWindowFrontend from 'wix-window-frontend';

$w.onReady(function () {
    const url = 'https://www.cepea.esalq.usp.br/br';

    function extractExchangeRateFromHTML(html) {
        const startIndex = html.indexOf('<table class="imagenet-table imagenet-th1">');
        const innerStartIndex = html.indexOf('R$', startIndex);
        const endIndex = html.indexOf('|', innerStartIndex);
        const exchangeRateString = html.substring(innerStartIndex + 10, endIndex).trim();
        const exchangeRate = parseFloat(exchangeRateString.replace(',', '.'));
        return exchangeRate;
        
    }

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

    function extractDataFromHTML(html, exchangeRate) {
        const data = [];
        const startIndex = html.indexOf('<tbody>');
        const endIndex = html.indexOf('</tbody>', startIndex);
        const tableBody = html.substring(startIndex, endIndex);
        const rows = tableBody.split('</tr>');
        rows.forEach(row => {
            const nameStartIndex = row.indexOf('<span class="maior">') + '<span class="maior">'.length;
            const nameEndIndex = row.indexOf('</span>', nameStartIndex);
            const name = row.substring(nameStartIndex, nameEndIndex);
            const priceStartIndex = row.indexOf('<span class="maior">', nameEndIndex) + '<span class="maior">'.length;
            const priceEndIndex = row.indexOf('</span>', priceStartIndex);
            const price = row.substring(priceStartIndex, priceEndIndex);
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
			// console.log(item.price)
			// console.log('Un-live Price ' + parseFloat(item.price.replace(',', '.'))*0.2)
            let price = (parseFloat(item.price.replace(',', '.')) / exchangeRate).toFixed(2);
            newData[newName] = 'US$' + price;
        }
        return newData;
    }

    let formFactor = wixWindowFrontend.formFactor;
	let exchangeRate = 4.977
    // Fetch HTML content and extract exchange rate
    fetchExternalHTML(url)
        .then(html => {
            if (extractExchangeRateFromHTML(html)) {
				exchangeRate = extractExchangeRateFromHTML(html);
			}
			console.log('Exchange Rate: ' + exchangeRate)
            return exchangeRate;
        })
        .then(exchangeRate => {
            // Fetch HTML content and extract desired data
            fetchExternalHTML('https://www.cepea.esalq.usp.br/br/widgetproduto.js.php?fonte=arial&tamanho=10&largura=400px&corfundo=dbd6b2&cortexto=333333&corlinha=ede7bf&id_indicador%5B%5D=23&id_indicador%5B%5D=143&id_indicador%5B%5D=92')
                .then(html => {
                    const data = extractDataFromHTML(html, exchangeRate);
                    // Update text elements with extracted data
                    $w("#text19").text = `${Object.keys(data)[0]} : ${Object.values(data)[0]}`;
                    $w("#text20").text = `${Object.keys(data)[1]} : ${Object.values(data)[1]}`;
                    $w("#text21").text = `${Object.keys(data)[2]} : ${Object.values(data)[2]}`;
                    $w("#text22").text = `${Object.keys(data)[0]} : ${Object.values(data)[0]}`;
                    $w("#text23").text = `${Object.keys(data)[1]} : ${Object.values(data)[1]}`;
                    $w("#text24").text = `${Object.keys(data)[2]} : ${Object.values(data)[2]}`;
                    $w('#box4').show();

                    if (formFactor == 'Mobile') {
                        animateTextMobile();
                        setInterval(animateTextMobile, 36000);
                    } else if (formFactor == 'Desktop') {
                        animateTextDesktop();
                        setInterval(animateTextDesktop, 36000);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        })
        .catch(error => {
            console.error('Error fetching exchange rate:', error);
        });

    function animateTextDesktop() {
        const revealTimeline = timeline()
            .add($w('#box4'), {duration: 18000, x: -1300, easing: 'easeInOutSine'})
            .play();
        revealTimeline.onComplete(() => {
            revealTimeline.reverse();
        });
    }

    function animateTextMobile() {
        const revealTimeline = timeline()
            .add($w('#box4'), {duration: 18000, x: -750, easing: 'easeInOutSine'})
            .play();
        revealTimeline.onComplete(() => {
            revealTimeline.reverse();
        });
    }
});
