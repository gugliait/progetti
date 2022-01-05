export const Helper =  {

    isBlank : (str) => {
        return (!str || /^\s*$/.test(str));
    },

    isEmpty: (str) => {
        return (!str || str.length === 0 );
    },

    /**
     * 
     * @param {Prende in input un oggetto data(new Date())} date 
     * @returns ritorna ladata locale così formattata 2022-01-01T14:33:55.556Z
     */
    toIsoStringInLocalTime: (date) => {
        return new Date((date.getTime() + (-date.getTimezoneOffset() * 60000))).toISOString()
    }

}
