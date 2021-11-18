(function () {
/* Polyfills */

    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }

    var initialized = false;
    var initialize = function () {
        if (!initialized) {
            initialized = true;
            document.querySelectorAll('.expandable-node').forEach(function (x) {
                x.addEventListener('click', function (e) {
                    if (window.DataIntelligenceSubmitScript && e.currentTarget.hasAttribute('aria-expanded') === 'false') {
                        DataIntelligenceSubmitScript._client.sentenceClient.writeSentence({
                            predicate: "Toggle navigation",
                            object: e.currentTarget.innerText.trim(),
                            objectMetadata: [{
                                'K': 'PageTitle',
                                'V': document.title
                            },
                            {
                                'K': 'PageUrl',
                                'V': location.href
                            }
                            ]
                        });
                    }
                });
            });
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        initialize();
    });

    if (window.personalizationManager) {
        window.personalizationManager.addPersonalizedContentLoaded(function () {
            initialize();
        });
    }
}());