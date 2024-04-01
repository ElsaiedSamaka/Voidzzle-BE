import DatauriParser from 'datauri/parser';

const parser = new DatauriParser();

// Data uri helper function
const dataUri = (file) => parser.format('.png', file?.buffer);

export default dataUri;
