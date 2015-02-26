angular.module('starter.MatchesController', [])

.controller('MatchesController', function(
    $scope,
    Match,
    Network
){
    /**
     * Diz se ouve erro de comunicação com o servidor
     * pode ocorreu caso cai a internet do aparelho ou por outros diversos motivos
     * como o servidor demorar para responder. Está variavel alterna o seu valor durante
     * todo o ciclo de funcionamento da view de acordo com as resquisições ao Webservice
     * @type {Boolean}
     */
    $scope.communicationError = false;

    /**
     * Controla a frase "Você não possui nenhuma combinação", ele soh recebe true
     * quando o ::loadMore ou o ::refreshMatches retornam vazio estando na página 0
     * @type {Boolean}
     */
    $scope.noMatches = false;

    /**
     * Todas as combinações
     * @type {Array}
     */
    $scope.matches = [];

    /**
     * Habilita e desabilita o infinite scroll
     * @type {Boolean}
     */
    $scope.noMoreItemsAvailable = false;

    /**
     * Controla a paginação das combinações em junção com a infinite scroll
     * @type {Number}
     */
    $scope.page = 0;

    /**
     * Carrega combinações paginando juntamente com o infinite scroll
     * @return void
     */
    $scope.loadMore = function(){
        Network.check()
            .then(function(result){
                /**
                 * Pega as combinações com a paginação 0, ou seja, do começo.
                 */
                Match.getPaginate($scope.page)
                    .then(function(result){
                        var concat = $scope.matches.concat(result);
                        $scope.matches = concat;

                        $scope.communicationError = false;
                        
                        $scope.checkMatchesServerReturn(result);

                        console.log('Page: ' + $scope.page);
                    }, function(err){
                        // Se der erro encerra o infinite scroll
                        // e deixa usuario fazer o refresh pelo pull to refresh
                        $scope.communicationError = false;
                        $scope.noMoreItemsAvailable = true;
                    })
                    .finally(function(){
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
            }, function(err){
                $scope.communicationError = true;
                $scope.noMoreItemsAvailable = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    /**
     * Atualiza as combinações quando se usa o pull to refresh
     * @return void
     */
    $scope.refreshMatches = function(){
        // Desabilita o infinite scroll, ele estando aparecendo na tela ou nao
        $scope.noMoreItemsAvailable = true;
        // Zera a pagina atual já que começaremos a paginação do começo
        $scope.page = 0;
        Network.check()
            .then(function(result){
                /**
                 * Pega as combinações com a paginação 0, ou seja, do começo
                 */
                Match.getPaginate($scope.page)
                    .then(function(result){
                        console.log(result);
                        // Só zera as combinações no then, pq se caiu aqui eh pq tem resultado
                        // ou seja, aqui de fato que o "refresh" irá acontecer
                        $scope.matches = [];
                        var concat = $scope.matches.concat(result);
                        $scope.matches = concat;

                        $scope.checkMatchesServerReturn(result);

                        // Reabilita o infinite scroll e deixa ele fazer o trabalho dele
                        $scope.noMoreItemsAvailable = false;

                        $scope.communicationError = false;

                    }, function(err){
                        $scope.communicationError = true;
                    })
                    .finally(function(){
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }, function(err){
                $scope.communicationError = true;
                $scope.noMoreItemsAvailable = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    /**
     * Trata o retorno do server para combinações, ele verifica se será necessario carregar mais no caso 
     * do ::loadMore, no caso do ::refreshMatches ele verifica se não retornou nada na primeira pagina
     * caso isso ocorra ele seta a variavel '$scope.noMathes' para true assim aoarece a mensagem
     * de 'você não tem nenhuma combinação' na view.
     * ele também incrementa a '$scope.page' se necessario
     * 
     * @param  {array} serverReturn     Retorno do server
     * @return {void}              
     */
    $scope.checkMatchesServerReturn = function(serverReturn){
        // Se não retornar nada e estiver na primeira pagina quer dize que ele nao tem nenhum
        // entao seta a variavel para aparecer mensagem na tela
        if (serverReturn.length === 0 && $scope.page === 0) {
            $scope.noMatches = true;
        }

        // Se retornar vazio ele some com o infinite scroll caso contrario
        // incrementa a pagina para pegar mais da proxima
        if(serverReturn.length === 0){
            $scope.noMoreItemsAvailable = true;
        } else {
            $scope.page++;
        }
    };

});