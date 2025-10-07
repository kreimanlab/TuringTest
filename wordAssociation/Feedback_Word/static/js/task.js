/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1_free.html",
	"instructions/instruct-ready.html",
	"instructions/instruct-quit.html",
	"prequestionnaire.html",
	"stage.html",
	"postquestionnaire.html",
];

psiTurk.preloadPages(pages);

var trainlist = ['28', '6', '70', '62', '57', '35', '26', '139', '22', '108', '8', '7', '23', '55', '59', '129', '148', '50', '107', '56', '114', '71', '1', '97', '103', '20', '89', '54', '43', '144', '19', '27', '126', '121', '13', '11', '48', '12', '45', '140', '44', '77', '33', '125', '5', '93', '58', '68', '15', '113', '10', '147', '37', '80', '79', '46', '73', '24', '90', '142', '105', '84', '29', '117', '99', '87', '112', '100', '120', '106', '94', '124', '47', '111', '143']

var testlist = ['0', '2', '3', '4', '9', '14', '16', '17', '18', '21', '25', '30', '31', '32', '34', '36', '38', '39', '40', '41', '42', '49', '51', '52', '53', '60', '61', '63', '64', '65', '66', '67', '69', '72', '74', '75', '76', '78', '81', '82', '83', '85', '86', '88', '91', '92', '95', '96', '98', '101', '102', '104', '109', '110', '115', '116', '118', '119', '122', '123', '127', '128', '130', '131', '132', '133', '134', '135', '136', '137', '138', '141', '145', '146', '149']



var aTrain = ['44_a_1.html', '5_a_4.html', '121_a_1.html', '73_a_3.html', '15_a_3.html', '126_a_1.html', '20_a_3.html', '68_a_3.html', '84_a_4.html', '10_a_3.html', '70_a_0.html', '113_a_3.html', '20_a_4.html', '37_a_1.html', '58_a_3.html', '94_a_2.html', '129_a_3.html', '106_a_0.html', '106_a_4.html', '45_a_3.html', '105_a_1.html', '103_a_0.html', '43_a_0.html', '142_a_2.html', '97_a_0.html', '94_a_3.html', '6_a_4.html', '27_a_0.html', '33_a_3.html', '87_a_3.html', '84_a_0.html', '57_a_1.html', '54_a_2.html', '55_a_3.html', '103_a_2.html', '90_a_1.html', '7_a_1.html', '29_a_4.html', '87_a_2.html', '139_a_2.html', '28_a_0.html', '87_a_1.html', '43_a_2.html', '47_a_4.html', '140_a_4.html', '1_a_1.html', '120_a_2.html', '58_a_0.html', '111_a_4.html', '62_a_0.html', '15_a_1.html', '99_a_0.html', '57_a_4.html', '48_a_1.html', '43_a_4.html', '58_a_4.html', '73_a_0.html', '140_a_0.html', '8_a_4.html', '124_a_3.html', '144_a_3.html', '59_a_2.html', '120_a_0.html', '94_a_0.html', '8_a_2.html', '19_a_2.html', '24_a_4.html', '80_a_4.html', '125_a_3.html', '24_a_3.html', '5_a_3.html', '71_a_0.html', '80_a_1.html', '56_a_4.html', '29_a_0.html', '117_a_0.html', '105_a_2.html', '1_a_4.html', '117_a_4.html', '114_a_0.html', '103_a_4.html', '45_a_2.html', '47_a_2.html', '44_a_4.html', '59_a_1.html', '90_a_0.html', '70_a_2.html', '97_a_4.html', '77_a_3.html', '140_a_3.html', '89_a_1.html', '6_a_1.html', '139_a_1.html', '26_a_0.html', '125_a_0.html', '89_a_2.html', '48_a_4.html', '44_a_0.html', '27_a_4.html', '129_a_2.html', '148_a_2.html', '22_a_3.html', '10_a_4.html', '117_a_2.html', '93_a_1.html', '84_a_3.html', '33_a_1.html', '44_a_3.html', '97_a_1.html', '107_a_1.html', '24_a_0.html', '142_a_0.html', '111_a_0.html', '100_a_1.html', '121_a_2.html', '80_a_3.html', '71_a_1.html', '28_a_3.html', '48_a_2.html', '13_a_1.html', '125_a_1.html', '28_a_4.html', '37_a_4.html', '93_a_3.html', '147_a_1.html', '107_a_3.html', '79_a_4.html', '11_a_4.html', '143_a_4.html', '62_a_2.html', '55_a_0.html', '19_a_1.html', '5_a_0.html', '27_a_2.html', '47_a_3.html', '80_a_0.html', '56_a_1.html', '105_a_4.html', '12_a_3.html', '35_a_0.html', '93_a_4.html', '144_a_1.html', '99_a_1.html', '13_a_0.html', '6_a_2.html', '100_a_3.html', '139_a_4.html', '33_a_2.html', '139_a_3.html', '56_a_2.html', '129_a_1.html', '54_a_0.html', '46_a_2.html', '26_a_4.html', '77_a_2.html', '144_a_0.html', '48_a_0.html', '11_a_0.html', '126_a_4.html', '37_a_0.html', '27_a_1.html', '29_a_3.html', '111_a_1.html', '22_a_0.html', '100_a_0.html', '19_a_4.html', '6_a_3.html', '114_a_4.html', '6_a_0.html', '77_a_4.html', '125_a_2.html', '147_a_4.html', '94_a_1.html', '129_a_4.html', '5_a_2.html', '19_a_3.html', '148_a_3.html', '70_a_4.html', '62_a_4.html', '59_a_4.html', '114_a_1.html', '24_a_1.html', '117_a_1.html', '8_a_1.html', '23_a_1.html', '35_a_2.html', '148_a_1.html', '20_a_0.html', '93_a_2.html', '87_a_0.html', '7_a_4.html', '129_a_0.html', '7_a_2.html', '106_a_2.html', '148_a_4.html', '15_a_0.html', '46_a_1.html', '12_a_1.html', '54_a_1.html', '68_a_1.html', '1_a_0.html', '124_a_2.html', '26_a_2.html', '24_a_2.html', '143_a_2.html', '73_a_2.html', '114_a_2.html', '112_a_1.html', '79_a_3.html', '35_a_3.html', '120_a_4.html', '73_a_1.html', '114_a_3.html', '23_a_3.html', '50_a_2.html', '111_a_3.html', '140_a_2.html', '44_a_2.html', '143_a_3.html', '11_a_2.html', '112_a_4.html', '73_a_4.html', '89_a_4.html', '55_a_2.html', '57_a_0.html', '37_a_3.html', '29_a_2.html', '113_a_4.html', '139_a_0.html', '103_a_1.html', '35_a_1.html', '55_a_4.html', '84_a_2.html', '108_a_4.html', '10_a_0.html', '108_a_3.html', '84_a_1.html', '35_a_4.html', '100_a_2.html', '46_a_0.html', '62_a_1.html', '108_a_2.html', '77_a_0.html', '99_a_3.html', '15_a_2.html', '121_a_0.html', '80_a_2.html', '97_a_3.html', '56_a_3.html', '58_a_2.html', '57_a_3.html', '121_a_4.html', '50_a_0.html', '120_a_3.html', '106_a_1.html', '124_a_4.html', '59_a_3.html', '113_a_0.html', '117_a_3.html', '57_a_2.html', '70_a_3.html', '59_a_0.html', '10_a_2.html', '54_a_3.html', '71_a_4.html', '143_a_0.html', '124_a_0.html', '79_a_1.html', '121_a_3.html', '144_a_4.html', '5_a_1.html', '1_a_3.html', '13_a_3.html', '48_a_3.html', '87_a_4.html', '68_a_0.html', '126_a_2.html', '23_a_2.html', '62_a_3.html', '108_a_0.html', '93_a_0.html', '120_a_1.html', '50_a_1.html', '20_a_2.html', '43_a_3.html', '113_a_1.html', '19_a_0.html', '90_a_3.html', '112_a_0.html', '58_a_1.html', '27_a_3.html', '77_a_1.html', '43_a_1.html', '97_a_2.html', '89_a_3.html', '105_a_3.html', '13_a_4.html', '26_a_3.html', '22_a_4.html', '54_a_4.html', '68_a_4.html', '108_a_1.html', '23_a_0.html', '105_a_0.html', '68_a_2.html', '126_a_0.html', '148_a_0.html', '29_a_1.html', '143_a_1.html', '37_a_2.html', '142_a_3.html', '46_a_3.html', '45_a_0.html', '56_a_0.html', '140_a_1.html', '12_a_2.html', '12_a_0.html', '11_a_1.html', '124_a_1.html', '99_a_4.html', '55_a_1.html', '107_a_0.html', '11_a_3.html', '7_a_3.html', '90_a_4.html', '103_a_3.html', '46_a_4.html', '125_a_4.html', '45_a_1.html', '28_a_2.html', '142_a_4.html', '89_a_0.html', '94_a_4.html', '112_a_3.html', '28_a_1.html', '50_a_3.html', '50_a_4.html', '13_a_2.html', '12_a_4.html', '142_a_1.html', '26_a_1.html', '113_a_2.html', '100_a_4.html', '111_a_2.html', '47_a_1.html', '126_a_3.html', '147_a_0.html', '112_a_2.html', '71_a_3.html', '15_a_4.html', '79_a_0.html', '99_a_2.html', '147_a_2.html', '1_a_2.html', '107_a_2.html', '23_a_4.html', '47_a_0.html', '45_a_4.html', '7_a_0.html', '107_a_4.html', '8_a_0.html', '8_a_3.html', '79_a_2.html', '106_a_3.html', '33_a_4.html', '10_a_1.html', '20_a_1.html', '22_a_1.html', '90_a_2.html', '147_a_3.html', '70_a_1.html', '22_a_2.html', '71_a_2.html', '33_a_0.html', '144_a_2.html']

var aTest = ['130_a_1.html', '61_a_1.html', '3_a_0.html', '141_a_0.html', '141_a_1.html', '149_a_3.html', '101_a_4.html', '116_a_1.html', '40_a_2.html', '36_a_4.html', '53_a_3.html', '130_a_4.html', '36_a_0.html', '75_a_3.html', '2_a_2.html', '3_a_4.html', '74_a_3.html', '64_a_0.html', '85_a_0.html', '66_a_1.html', '66_a_2.html', '115_a_4.html', '31_a_0.html', '91_a_4.html', '91_a_2.html', '138_a_4.html', '95_a_3.html', '17_a_1.html', '130_a_3.html', '25_a_1.html', '149_a_1.html', '72_a_1.html', '51_a_1.html', '40_a_4.html', '0_a_2.html', '9_a_2.html', '2_a_3.html', '32_a_2.html', '9_a_0.html', '122_a_3.html', '137_a_2.html', '81_a_1.html', '134_a_3.html', '92_a_4.html', '92_a_0.html', '32_a_4.html', '14_a_1.html', '17_a_3.html', '118_a_3.html', '127_a_2.html', '86_a_0.html', '98_a_4.html', '25_a_0.html', '82_a_4.html', '104_a_3.html', '32_a_3.html', '63_a_0.html', '135_a_0.html', '4_a_2.html', '78_a_1.html', '60_a_4.html', '131_a_2.html', '61_a_4.html', '14_a_4.html', '25_a_3.html', '119_a_2.html', '49_a_1.html', '69_a_1.html', '16_a_4.html', '136_a_3.html', '116_a_2.html', '137_a_1.html', '65_a_4.html', '145_a_2.html', '109_a_3.html', '52_a_2.html', '110_a_2.html', '3_a_3.html', '132_a_0.html', '130_a_2.html', '34_a_4.html', '85_a_2.html', '60_a_2.html', '0_a_4.html', '74_a_0.html', '96_a_2.html', '21_a_0.html', '41_a_1.html', '127_a_4.html', '63_a_1.html', '67_a_4.html', '127_a_0.html', '65_a_0.html', '31_a_1.html', '86_a_1.html', '78_a_2.html', '39_a_2.html', '0_a_3.html', '41_a_0.html', '98_a_1.html', '76_a_3.html', '133_a_0.html', '95_a_0.html', '85_a_4.html', '25_a_2.html', '135_a_1.html', '102_a_1.html', '30_a_0.html', '9_a_1.html', '149_a_0.html', '132_a_3.html', '31_a_3.html', '138_a_3.html', '21_a_4.html', '4_a_3.html', '118_a_0.html', '69_a_3.html', '2_a_4.html', '104_a_0.html', '86_a_3.html', '104_a_4.html', '119_a_1.html', '4_a_1.html', '128_a_4.html', '49_a_0.html', '86_a_2.html', '53_a_2.html', '102_a_2.html', '78_a_4.html', '134_a_4.html', '30_a_1.html', '76_a_0.html', '75_a_2.html', '91_a_0.html', '39_a_1.html', '25_a_4.html', '14_a_2.html', '4_a_4.html', '66_a_0.html', '65_a_3.html', '91_a_1.html', '91_a_3.html', '83_a_1.html', '34_a_1.html', '82_a_3.html', '17_a_0.html', '52_a_1.html', '133_a_1.html', '88_a_4.html', '72_a_3.html', '127_a_1.html', '31_a_2.html', '53_a_1.html', '38_a_0.html', '98_a_0.html', '102_a_3.html', '134_a_0.html', '116_a_4.html', '34_a_0.html', '110_a_4.html', '21_a_2.html', '127_a_3.html', '51_a_0.html', '128_a_1.html', '133_a_3.html', '88_a_0.html', '66_a_4.html', '3_a_2.html', '116_a_3.html', '92_a_1.html', '42_a_4.html', '30_a_3.html', '123_a_2.html', '16_a_3.html', '131_a_3.html', '18_a_3.html', '2_a_0.html', '36_a_2.html', '95_a_1.html', '149_a_4.html', '41_a_2.html', '115_a_3.html', '132_a_2.html', '82_a_1.html', '9_a_4.html', '52_a_0.html', '146_a_0.html', '78_a_3.html', '60_a_1.html', '53_a_0.html', '42_a_0.html', '76_a_1.html', '81_a_0.html', '0_a_1.html', '61_a_3.html', '123_a_0.html', '83_a_2.html', '16_a_0.html', '2_a_1.html', '30_a_4.html', '118_a_2.html', '75_a_1.html', '49_a_2.html', '81_a_4.html', '72_a_2.html', '88_a_1.html', '81_a_2.html', '98_a_2.html', '51_a_3.html', '136_a_2.html', '53_a_4.html', '65_a_2.html', '145_a_3.html', '51_a_4.html', '67_a_1.html', '128_a_2.html', '39_a_3.html', '83_a_4.html', '138_a_2.html', '38_a_2.html', '137_a_4.html', '134_a_1.html', '40_a_0.html', '32_a_0.html', '109_a_1.html', '81_a_3.html', '82_a_2.html', '36_a_1.html', '146_a_4.html', '123_a_1.html', '17_a_2.html', '75_a_0.html', '109_a_2.html', '128_a_3.html', '122_a_0.html', '95_a_4.html', '131_a_1.html', '21_a_1.html', '96_a_3.html', '146_a_1.html', '76_a_4.html', '18_a_0.html', '0_a_0.html', '34_a_2.html', '14_a_0.html', '102_a_4.html', '110_a_0.html', '63_a_3.html', '88_a_2.html', '136_a_4.html', '128_a_0.html', '76_a_2.html', '88_a_3.html', '132_a_1.html', '137_a_3.html', '122_a_2.html', '145_a_0.html', '64_a_3.html', '65_a_1.html', '133_a_2.html', '64_a_2.html', '141_a_2.html', '16_a_1.html', '49_a_3.html', '34_a_3.html', '98_a_3.html', '36_a_3.html', '102_a_0.html', '74_a_1.html', '146_a_2.html', '137_a_0.html', '49_a_4.html', '63_a_2.html', '122_a_1.html', '75_a_4.html', '115_a_0.html', '32_a_1.html', '52_a_3.html', '69_a_0.html', '92_a_2.html', '69_a_4.html', '42_a_1.html', '18_a_1.html', '119_a_4.html', '134_a_2.html', '104_a_1.html', '40_a_1.html', '51_a_2.html', '123_a_3.html', '115_a_2.html', '83_a_3.html', '130_a_0.html', '101_a_0.html', '138_a_1.html', '110_a_1.html', '136_a_0.html', '14_a_3.html', '131_a_4.html', '41_a_3.html', '96_a_4.html', '38_a_1.html', '72_a_0.html', '18_a_4.html', '101_a_2.html', '21_a_3.html', '64_a_4.html', '66_a_3.html', '60_a_0.html', '41_a_4.html', '132_a_4.html', '146_a_3.html', '39_a_4.html', '109_a_4.html', '16_a_2.html', '95_a_2.html', '85_a_1.html', '69_a_2.html', '61_a_0.html', '118_a_1.html', '86_a_4.html', '72_a_4.html', '82_a_0.html', '67_a_3.html', '83_a_0.html', '38_a_4.html', '40_a_3.html', '64_a_1.html', '118_a_4.html', '42_a_3.html', '101_a_1.html', '104_a_2.html', '123_a_4.html', '30_a_2.html', '135_a_4.html', '145_a_4.html', '92_a_3.html', '74_a_2.html', '3_a_1.html', '74_a_4.html', '138_a_0.html', '61_a_2.html', '96_a_0.html', '136_a_1.html', '9_a_3.html', '135_a_2.html', '109_a_0.html', '31_a_4.html', '116_a_0.html', '4_a_0.html', '141_a_3.html', '119_a_0.html', '60_a_3.html', '115_a_1.html', '135_a_3.html', '39_a_0.html', '101_a_3.html', '149_a_2.html', '52_a_4.html', '78_a_0.html', '17_a_4.html', '63_a_4.html', '96_a_1.html', '141_a_4.html', '42_a_2.html', '67_a_0.html', '18_a_2.html', '119_a_3.html', '110_a_3.html', '122_a_4.html', '131_a_0.html', '38_a_3.html', '67_a_2.html', '133_a_4.html', '85_a_3.html', '145_a_1.html']


var bTrain = ['93_b_0.html', '55_b_0.html', '54_b_0.html', '20_b_0.html', '70_b_0.html', '7_b_0.html', '114_b_0.html', '62_b_0.html', '111_b_0.html', '87_b_0.html', '27_b_0.html', '68_b_0.html', '58_b_0.html', '106_b_0.html', '23_b_0.html', '79_b_0.html', '107_b_0.html', '35_b_0.html', '28_b_0.html', '80_b_0.html', '120_b_0.html', '15_b_0.html', '105_b_0.html', '43_b_0.html', '90_b_0.html', '10_b_0.html', '29_b_0.html', '46_b_0.html', '100_b_0.html', '144_b_0.html', '22_b_0.html', '11_b_0.html', '44_b_0.html', '45_b_0.html', '59_b_0.html', '48_b_0.html', '6_b_0.html', '117_b_0.html', '50_b_0.html', '84_b_0.html', '24_b_0.html', '113_b_0.html', '108_b_0.html', '125_b_0.html', '124_b_0.html', '8_b_0.html', '37_b_0.html', '13_b_0.html', '56_b_0.html', '89_b_0.html', '77_b_0.html', '1_b_0.html', '121_b_0.html', '57_b_0.html', '26_b_0.html', '12_b_0.html', '126_b_0.html', '5_b_0.html', '71_b_0.html', '112_b_0.html', '143_b_0.html', '97_b_0.html', '73_b_0.html', '19_b_0.html', '47_b_0.html', '148_b_0.html', '147_b_0.html', '103_b_0.html', '142_b_0.html', '129_b_0.html', '33_b_0.html', '139_b_0.html', '94_b_0.html', '99_b_0.html', '140_b_0.html']

var bTest = ['149_b_0.html', '98_b_0.html', '9_b_0.html', '64_b_0.html', '138_b_0.html', '51_b_0.html', '141_b_0.html', '135_b_0.html', '76_b_0.html', '78_b_0.html', '109_b_0.html', '133_b_0.html', '67_b_0.html', '130_b_0.html', '49_b_0.html', '38_b_0.html', '3_b_0.html', '116_b_0.html', '104_b_0.html', '4_b_0.html', '36_b_0.html', '65_b_0.html', '16_b_0.html', '118_b_0.html', '60_b_0.html', '34_b_0.html', '82_b_0.html', '40_b_0.html', '101_b_0.html', '61_b_0.html', '146_b_0.html', '83_b_0.html', '85_b_0.html', '18_b_0.html', '21_b_0.html', '14_b_0.html', '81_b_0.html', '74_b_0.html', '17_b_0.html', '52_b_0.html', '145_b_0.html', '128_b_0.html', '30_b_0.html', '115_b_0.html', '0_b_0.html', '31_b_0.html', '92_b_0.html', '63_b_0.html', '123_b_0.html', '39_b_0.html', '136_b_0.html', '42_b_0.html', '69_b_0.html', '132_b_0.html', '110_b_0.html', '75_b_0.html', '96_b_0.html', '41_b_0.html', '131_b_0.html', '72_b_0.html', '66_b_0.html', '86_b_0.html', '134_b_0.html', '119_b_0.html', '91_b_0.html', '127_b_0.html', '122_b_0.html', '2_b_0.html', '32_b_0.html', '102_b_0.html', '25_b_0.html', '137_b_0.html', '95_b_0.html', '53_b_0.html', '88_b_0.html']


var cTrain = ['89_c_0.html', '24_c_0.html', '45_c_0.html', '22_c_0.html', '50_c_0.html', '70_c_0.html', '33_c_0.html', '84_c_0.html', '46_c_0.html', '129_c_0.html', '80_c_0.html', '8_c_0.html', '147_c_0.html', '20_c_0.html', '27_c_0.html', '87_c_0.html', '108_c_0.html', '113_c_0.html', '121_c_0.html', '125_c_0.html', '10_c_0.html', '47_c_0.html', '68_c_0.html', '43_c_0.html', '5_c_0.html', '44_c_0.html', '12_c_0.html', '55_c_0.html', '6_c_0.html', '124_c_0.html', '35_c_0.html', '15_c_0.html', '54_c_0.html', '99_c_0.html', '62_c_0.html', '26_c_0.html', '58_c_0.html', '120_c_0.html', '97_c_0.html', '148_c_0.html', '28_c_0.html', '93_c_0.html', '107_c_0.html', '7_c_0.html', '140_c_0.html', '111_c_0.html', '90_c_0.html', '29_c_0.html', '37_c_0.html', '100_c_0.html', '59_c_0.html', '143_c_0.html', '23_c_0.html', '112_c_0.html', '117_c_0.html', '71_c_0.html', '142_c_0.html', '79_c_0.html', '77_c_0.html', '139_c_0.html', '144_c_0.html', '11_c_0.html', '1_c_0.html', '19_c_0.html', '126_c_0.html', '48_c_0.html', '13_c_0.html', '103_c_0.html', '56_c_0.html', '105_c_0.html', '106_c_0.html', '73_c_0.html', '114_c_0.html', '57_c_0.html', '94_c_0.html']

var cTest = ['82_c_0.html', '40_c_0.html', '83_c_0.html', '60_c_0.html', '133_c_0.html', '123_c_0.html', '16_c_0.html', '39_c_0.html', '72_c_0.html', '53_c_0.html', '119_c_0.html', '9_c_0.html', '61_c_0.html', '128_c_0.html', '66_c_0.html', '30_c_0.html', '3_c_0.html', '78_c_0.html', '42_c_0.html', '92_c_0.html', '134_c_0.html', '75_c_0.html', '116_c_0.html', '118_c_0.html', '135_c_0.html', '101_c_0.html', '115_c_0.html', '32_c_0.html', '136_c_0.html', '31_c_0.html', '4_c_0.html', '91_c_0.html', '141_c_0.html', '69_c_0.html', '74_c_0.html', '132_c_0.html', '21_c_0.html', '102_c_0.html', '67_c_0.html', '34_c_0.html', '64_c_0.html', '18_c_0.html', '63_c_0.html', '14_c_0.html', '137_c_0.html', '138_c_0.html', '52_c_0.html', '49_c_0.html', '127_c_0.html', '25_c_0.html', '86_c_0.html', '109_c_0.html', '81_c_0.html', '38_c_0.html', '130_c_0.html', '17_c_0.html', '36_c_0.html', '104_c_0.html', '122_c_0.html', '98_c_0.html', '2_c_0.html', '51_c_0.html', '95_c_0.html', '145_c_0.html', '96_c_0.html', '41_c_0.html', '85_c_0.html', '149_c_0.html', '110_c_0.html', '76_c_0.html', '131_c_0.html', '146_c_0.html', '88_c_0.html', '65_c_0.html', '0_c_0.html']


var dTrain = ['33_d_0.html', '8_d_0.html', '87_d_0.html', '29_d_0.html', '68_d_0.html', '26_d_0.html', '54_d_0.html', '1_d_0.html', '58_d_0.html', '113_d_0.html', '50_d_0.html', '93_d_0.html', '94_d_0.html', '45_d_0.html', '107_d_0.html', '55_d_0.html', '73_d_0.html', '90_d_0.html', '27_d_0.html', '22_d_0.html', '46_d_0.html', '7_d_0.html', '125_d_0.html', '148_d_0.html', '99_d_0.html', '120_d_0.html', '100_d_0.html', '80_d_0.html', '47_d_0.html', '126_d_0.html', '28_d_0.html', '147_d_0.html', '15_d_0.html', '6_d_0.html', '77_d_0.html', '11_d_0.html', '111_d_0.html', '117_d_0.html', '103_d_0.html', '144_d_0.html', '114_d_0.html', '37_d_0.html', '48_d_0.html', '23_d_0.html', '105_d_0.html', '56_d_0.html', '70_d_0.html', '20_d_0.html', '79_d_0.html', '19_d_0.html', '89_d_0.html', '139_d_0.html', '44_d_0.html', '112_d_0.html', '140_d_0.html', '84_d_0.html', '121_d_0.html', '12_d_0.html', '10_d_0.html', '97_d_0.html', '62_d_0.html', '106_d_0.html', '129_d_0.html', '143_d_0.html', '124_d_0.html', '13_d_0.html', '57_d_0.html', '5_d_0.html', '71_d_0.html', '108_d_0.html', '24_d_0.html', '142_d_0.html', '35_d_0.html', '59_d_0.html', '43_d_0.html']

var dTest = ['135_d_0.html', '88_d_0.html', '14_d_0.html', '76_d_0.html', '64_d_0.html', '110_d_0.html', '49_d_0.html', '16_d_0.html', '149_d_0.html', '51_d_0.html', '86_d_0.html', '4_d_0.html', '118_d_0.html', '138_d_0.html', '95_d_0.html', '52_d_0.html', '141_d_0.html', '104_d_0.html', '98_d_0.html', '122_d_0.html', '65_d_0.html', '3_d_0.html', '116_d_0.html', '69_d_0.html', '66_d_0.html', '38_d_0.html', '0_d_0.html', '115_d_0.html', '102_d_0.html', '136_d_0.html', '81_d_0.html', '78_d_0.html', '42_d_0.html', '21_d_0.html', '60_d_0.html', '128_d_0.html', '18_d_0.html', '123_d_0.html', '145_d_0.html', '36_d_0.html', '17_d_0.html', '130_d_0.html', '31_d_0.html', '72_d_0.html', '96_d_0.html', '119_d_0.html', '101_d_0.html', '127_d_0.html', '34_d_0.html', '137_d_0.html', '67_d_0.html', '132_d_0.html', '2_d_0.html', '133_d_0.html', '61_d_0.html', '74_d_0.html', '91_d_0.html', '9_d_0.html', '25_d_0.html', '75_d_0.html', '32_d_0.html', '40_d_0.html', '146_d_0.html', '30_d_0.html', '83_d_0.html', '39_d_0.html', '82_d_0.html', '131_d_0.html', '41_d_0.html', '92_d_0.html', '53_d_0.html', '134_d_0.html', '109_d_0.html', '85_d_0.html', '63_d_0.html']


var eTrain = ['120_e_0.html', '87_e_0.html', '71_e_0.html', '45_e_0.html', '106_e_0.html', '90_e_0.html', '97_e_0.html', '8_e_0.html', '57_e_0.html', '144_e_0.html', '56_e_0.html', '43_e_0.html', '24_e_0.html', '107_e_0.html', '5_e_0.html', '139_e_0.html', '124_e_0.html', '58_e_0.html', '100_e_0.html', '84_e_0.html', '94_e_0.html', '6_e_0.html', '47_e_0.html', '148_e_0.html', '13_e_0.html', '7_e_0.html', '29_e_0.html', '62_e_0.html', '33_e_0.html', '108_e_0.html', '117_e_0.html', '15_e_0.html', '77_e_0.html', '143_e_0.html', '147_e_0.html', '111_e_0.html', '54_e_0.html', '48_e_0.html', '59_e_0.html', '112_e_0.html', '70_e_0.html', '22_e_0.html', '93_e_0.html', '114_e_0.html', '121_e_0.html', '26_e_0.html', '11_e_0.html', '99_e_0.html', '79_e_0.html', '27_e_0.html', '113_e_0.html', '28_e_0.html', '46_e_0.html', '37_e_0.html', '89_e_0.html', '35_e_0.html', '80_e_0.html', '140_e_0.html', '50_e_0.html', '105_e_0.html', '125_e_0.html', '73_e_0.html', '142_e_0.html', '20_e_0.html', '1_e_0.html', '55_e_0.html', '23_e_0.html', '103_e_0.html', '10_e_0.html', '129_e_0.html', '12_e_0.html', '126_e_0.html', '19_e_0.html', '68_e_0.html', '44_e_0.html']

var eTest = ['40_e_0.html', '52_e_0.html', '21_e_0.html', '101_e_0.html', '39_e_0.html', '32_e_0.html', '38_e_0.html', '118_e_0.html', '96_e_0.html', '119_e_0.html', '14_e_0.html', '31_e_0.html', '25_e_0.html', '30_e_0.html', '136_e_0.html', '116_e_0.html', '49_e_0.html', '127_e_0.html', '61_e_0.html', '134_e_0.html', '63_e_0.html', '18_e_0.html', '3_e_0.html', '67_e_0.html', '123_e_0.html', '41_e_0.html', '2_e_0.html', '66_e_0.html', '95_e_0.html', '122_e_0.html', '83_e_0.html', '86_e_0.html', '53_e_0.html', '91_e_0.html', '149_e_0.html', '65_e_0.html', '115_e_0.html', '141_e_0.html', '16_e_0.html', '76_e_0.html', '74_e_0.html', '4_e_0.html', '42_e_0.html', '82_e_0.html', '146_e_0.html', '110_e_0.html', '104_e_0.html', '131_e_0.html', '102_e_0.html', '36_e_0.html', '0_e_0.html', '81_e_0.html', '132_e_0.html', '92_e_0.html', '72_e_0.html', '135_e_0.html', '138_e_0.html', '9_e_0.html', '78_e_0.html', '75_e_0.html', '64_e_0.html', '145_e_0.html', '34_e_0.html', '85_e_0.html', '17_e_0.html', '88_e_0.html', '109_e_0.html', '128_e_0.html', '133_e_0.html', '69_e_0.html', '51_e_0.html', '98_e_0.html', '60_e_0.html', '137_e_0.html', '130_e_0.html']


var fTrain = ['35_f_0.html', '142_f_0.html', '23_f_0.html', '99_f_0.html', '124_f_0.html', '77_f_0.html', '79_f_0.html', '120_f_0.html', '43_f_0.html', '80_f_0.html', '59_f_0.html', '50_f_0.html', '6_f_0.html', '29_f_0.html', '111_f_0.html', '12_f_0.html', '105_f_0.html', '140_f_0.html', '28_f_0.html', '54_f_0.html', '100_f_0.html', '57_f_0.html', '46_f_0.html', '5_f_0.html', '58_f_0.html', '13_f_0.html', '47_f_0.html', '90_f_0.html', '24_f_0.html', '20_f_0.html', '144_f_0.html', '121_f_0.html', '1_f_0.html', '62_f_0.html', '22_f_0.html', '68_f_0.html', '114_f_0.html', '103_f_0.html', '56_f_0.html', '48_f_0.html', '147_f_0.html', '87_f_0.html', '45_f_0.html', '148_f_0.html', '19_f_0.html', '108_f_0.html', '70_f_0.html', '26_f_0.html', '93_f_0.html', '143_f_0.html', '139_f_0.html', '37_f_0.html', '8_f_0.html', '107_f_0.html', '27_f_0.html', '106_f_0.html', '94_f_0.html', '73_f_0.html', '113_f_0.html', '10_f_0.html', '15_f_0.html', '33_f_0.html', '71_f_0.html', '89_f_0.html', '117_f_0.html', '7_f_0.html', '126_f_0.html', '44_f_0.html', '11_f_0.html', '55_f_0.html', '112_f_0.html', '97_f_0.html', '129_f_0.html', '84_f_0.html', '125_f_0.html']

var fTest = ['118_f_0.html', '16_f_0.html', '2_f_0.html', '3_f_0.html', '40_f_0.html', '41_f_0.html', '31_f_0.html', '133_f_0.html', '127_f_0.html', '63_f_0.html', '65_f_0.html', '53_f_0.html', '38_f_0.html', '135_f_0.html', '102_f_0.html', '52_f_0.html', '74_f_0.html', '75_f_0.html', '25_f_0.html', '130_f_0.html', '109_f_0.html', '76_f_0.html', '34_f_0.html', '78_f_0.html', '91_f_0.html', '39_f_0.html', '85_f_0.html', '36_f_0.html', '17_f_0.html', '104_f_0.html', '110_f_0.html', '138_f_0.html', '98_f_0.html', '83_f_0.html', '141_f_0.html', '115_f_0.html', '95_f_0.html', '119_f_0.html', '134_f_0.html', '92_f_0.html', '61_f_0.html', '137_f_0.html', '116_f_0.html', '42_f_0.html', '60_f_0.html', '64_f_0.html', '4_f_0.html', '86_f_0.html', '128_f_0.html', '88_f_0.html', '18_f_0.html', '136_f_0.html', '146_f_0.html', '49_f_0.html', '131_f_0.html', '9_f_0.html', '122_f_0.html', '96_f_0.html', '149_f_0.html', '0_f_0.html', '69_f_0.html', '66_f_0.html', '30_f_0.html', '101_f_0.html', '14_f_0.html', '82_f_0.html', '132_f_0.html', '123_f_0.html', '21_f_0.html', '81_f_0.html', '51_f_0.html', '67_f_0.html', '72_f_0.html', '32_f_0.html', '145_f_0.html']

var gTest = ['74_g_0.html', '98_g_0.html', '101_g_0.html', '86_g_0.html', '2_g_0.html', '65_g_0.html', '21_g_0.html', '145_g_0.html', '115_g_0.html', '39_g_0.html', '82_g_0.html', '119_g_0.html', '95_g_0.html', '102_g_0.html', '104_g_0.html', '83_g_0.html', '75_g_0.html', '116_g_0.html', '49_g_0.html', '30_g_0.html', '67_g_0.html', '63_g_0.html', '40_g_0.html', '110_g_0.html', '3_g_0.html', '4_g_0.html', '109_g_0.html', '127_g_0.html', '72_g_0.html', '36_g_0.html', '133_g_0.html', '42_g_0.html', '66_g_0.html', '76_g_0.html', '18_g_0.html', '123_g_0.html', '134_g_0.html', '81_g_0.html', '32_g_0.html', '9_g_0.html', '130_g_0.html', '41_g_0.html', '60_g_0.html', '122_g_0.html', '131_g_0.html', '69_g_0.html', '0_g_0.html', '149_g_0.html', '135_g_0.html', '51_g_0.html', '17_g_0.html', '146_g_0.html', '64_g_0.html', '85_g_0.html', '38_g_0.html', '88_g_0.html', '16_g_0.html', '31_g_0.html', '128_g_0.html', '14_g_0.html', '137_g_0.html', '61_g_0.html', '91_g_0.html', '78_g_0.html', '92_g_0.html', '34_g_0.html', '138_g_0.html', '136_g_0.html', '118_g_0.html', '96_g_0.html', '141_g_0.html', '52_g_0.html', '25_g_0.html', '132_g_0.html', '53_g_0.html']


var instructionPages = [ // add as a list as many pages as you like
	"prequestionnaire.html",
	"instructions/instruct-1_free.html",
	"instructions/instruct-quit.html",
	"instructions/instruct-ready.html"
];

var random_flip = [0,1]
var human_machine = [0,1]
var human_subjects = ['0','1','2','3','4']
var machine_algos = ['b','c','d','e','f']
var humanNum = 20;
var machineNum = 4;
var totalTrain = 40;
var totalTest = 40;
var catchNum = 10;
var totalImageShown = 90;

/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and
* insert them into the document.
*
********************/

/********************
* STROOP TEST       *
********************/

var StroopExperiment = function() {

	psiTurk.recordUnstructuredData("mode", mode);

	var wordon;

	//Mengmi: generate random image list
	const ims_shown = 90;
	// var imagelist = [];
	var imagenamelist = [];
	var htmllist = [];
	var htmltestlist = [];
	var trialindex =-1;
	var numTestSamplesWithFeedback = 50;

	// aTrain = _.shuffle(aTrain)
	// aTest = _.shuffle(aTest)
	trainlist = _.shuffle(trainlist)
	testlist = _.shuffle(testlist)
	bTrain = _.shuffle(bTrain)
	bTest = _.shuffle(bTest)
	cTrain = _.shuffle(cTrain)
	cTest = _.shuffle(cTest)
	dTrain = _.shuffle(dTrain)
	dTest = _.shuffle(dTest)
	eTrain = _.shuffle(eTrain)
	eTest = _.shuffle(eTest)
	fTrain = _.shuffle(fTrain)
	fTest = _.shuffle(fTest)
	gTest = _.shuffle(gTest)
	// Train 20 + 5*4 = 40
	for (i = 0; i < humanNum; i++) {
		human_subjects = _.shuffle(human_subjects)
		human_subject = human_subjects[0]
		currhtml = trainlist[i]+'_'+'a'+'_'+human_subject+'.html'
		htmllist.push(currhtml);	
	}	
	for (i = 0; i < machineNum; i++) {htmllist.push(bTrain[i]);	}	
	for (i = 0; i < machineNum; i++) {htmllist.push(cTrain[i]);	}	
	for (i = 0; i < machineNum; i++) {htmllist.push(dTrain[i]);	}	
	for (i = 0; i < machineNum; i++) {htmllist.push(eTrain[i]);	}	
	for (i = 0; i < machineNum; i++) {htmllist.push(fTrain[i]);	}	

	htmllist = _.shuffle(htmllist)
	// Test 20 + 5*4 + 10 = 50
	for (i = 0; i < humanNum; i++) {
		human_subjects = _.shuffle(human_subjects)
		human_subject = human_subjects[0]
		currhtml = trainlist[i]+'_'+'a'+'_'+human_subject+'.html'
		htmllist.push(currhtml);	
	}
	for (i = 0; i < machineNum; i++) {htmltestlist.push(bTest[i]);	}	
	for (i = 0; i < machineNum; i++) {htmltestlist.push(cTest[i]);	}	
	for (i = 0; i < machineNum; i++) {htmltestlist.push(dTest[i]);	}	
	for (i = 0; i < machineNum; i++) {htmltestlist.push(eTest[i]);	}	
	for (i = 0; i < machineNum; i++) {htmltestlist.push(fTest[i]);	}	
	for (i = 0; i < catchNum; i++) {htmltestlist.push(gTest[i]);	}	
	htmltestlist = _.shuffle(htmltestlist)

	// add test list to the main list
	for (i = 0; i < numTestSamplesWithFeedback; i++) {htmllist.push(htmltestlist[i]);	}	


	// psiTurk.preloadImages(imagelist);
	// console.log(imagelist)

	// Stimuli for a basic Stroop experiment
	psiTurk.recordUnstructuredData("condition", condition);
	console.log(htmllist)
	var next = function() {
		if (htmllist.length===0) {
			finish();
		}
		else {
			document.getElementById("form1").style.display = 'inline';
			document.getElementById("feedback").style.display = 'none';
			document.getElementById("feedbackforward").style.display = 'none';
			document.getElementById("submittrial").style.display = 'inline';
			trialindex = trialindex+1;
			page_name = htmllist.shift();

			// human_machine = _.shuffle(human_machine)

			// if (human_machine[0] == 0) {
			// 	var page_name =  current_img_name + '_a_0.html'
			// }
			// else {
			// 	machine_algos = _.shuffle(machine_algos)
			// 	var page_name = current_img_name + '_' + machine_algos[0] + '_0.html'
			// }

			console.log(page_name)

			var current_conversation = 'static/responses_wordassoc/' + page_name
			// d3.select("#stim").html(current_conversation)
			$('#stimdisplay').attr('src', current_conversation)
			wordon = new Date().getTime();

		}
	};

	var finish = function() {
	    //$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};


	// Load the stage.html snippet into the body of the page
	// psiTurk.showPage('prequestionairre.html')
	psiTurk.showPage('stage.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	//$("body").focus().keydown(response_handler);

	// Start the test; initialize everything
	next();
	document.getElementById("submittrial").addEventListener("click", mengmiClick);
    document.getElementById("feedbackforward").style.display = 'none';
    document.getElementById("feedbackforward").addEventListener("click", nextClick);

	function nextClick()
	{
		//window.alert(imagelist.length);
		if (htmllist.length === numTestSamplesWithFeedback){
			
			window.alert("Reminder: From the next trial, there will not be feedback provided for the rest 50 trials. Please try your best to answer the questions.");
			//psiTurk.showPage("reminder.html");
			//document.getElementById("reminderforward").addEventListener("click", reminderClick);
		} 
		//else{
		next();
		//}
	}

	function mengmiClick()
	{
		var page_name = document.getElementById('stimdisplay').src;

		var response_speaker = "";
		// var speaker_human = document.getElementById("human");
		// var speaker_machine = document.getElementById("machine");
		// var object_dummy_yes = document.getElementById("topic1");
		// var object_dummy_no = document.getElementById("topic2");
		
		if (document.getElementById('machine').checked) {
			response_speaker = document.getElementById('machine').value;
		}
		else if(document.getElementById('human').checked) {
			response_speaker = document.getElementById('human').value;
		}

		var rt = new Date().getTime() - wordon;
		if ((response_speaker.length > 0) && rt >= 1500){
			document.getElementById("human").checked = false;
			document.getElementById("machine").checked = false;		
			psiTurk.recordTrialData({'phase':"TEST",
								 'page_name':page_name,
                                 'Aclass':response_speaker, //worker response for image name
								 'Agender':"NA",
                                 'hit':htmllist[trialindex], //index of image name
                                 'rt':rt, //response time
                             	 'trial': trialindex+1, //trial index starting from 1
                             	 }
                               );
							   if (htmllist.length >= numTestSamplesWithFeedback){
								if (page_name.includes('_a_')){
									gt = 'Human';
								}
								else{
									gt = 'Machine'
								}
								document.getElementById("form1").style.display = 'none';
								document.getElementById("feedback").style.display = 'block';
								d3.select("#feedback").html('<h3> The response is generated by <b><mark class="red">'+gt+'</mark></b>. Your answer is <b><mark class="red">'+ response_speaker +'</mark></b></h3>');
								document.getElementById("feedbackforward").style.display = 'inline';
								document.getElementById("feedbackforward").addEventListener("click", nextClick);
								document.getElementById("submittrial").style.display = 'none';
							}
							else{
								next();
							}	
							
		}
		else{
			if (rt < 1500) {
				window.alert("Warning: Please view the words and read the question carefully!!");
			}
			if (response_speaker.length === 0){
	    	window.alert("Warning: Please choose a response for each question before submitting!");			
			}
		}
	    
	}
};


/****************
* Questionnaire *
****************/
function instruct_ready() {
     psiTurk.showPage("instructions/instruct-ready.html")
}


function preques_submit() {

    record_responses = function() {

        native = document.getElementById("native").value;
        age = document.getElementById("age").value;
        gender = document.getElementById("gender").value;
        education = document.getElementById("education").value;
        country = document.getElementById("country").value;
        ai_experience = document.getElementById("ai-experience").value;

        if (native.length>0 && age.length>0 && gender.length>0 && education.length>0 && country.length>0 && ai_experience.length>0)
        {
            psiTurk.recordTrialData({'phase':'prequestionnaire', 'status':'submit'});
            psiTurk.recordUnstructuredData('native', native);
            psiTurk.recordUnstructuredData('age', age);
            psiTurk.recordUnstructuredData('gender', gender);
            psiTurk.recordUnstructuredData('education', education);
            psiTurk.recordUnstructuredData('country', country);
            psiTurk.recordUnstructuredData('ai-experience', ai_experience);
            // nonnative - quit
			if (native === "yes") {
				psiTurk.showPage("instructions/instruct-1_free.html");
			}    
			else{
				psiTurk.showPage("instructions/instruct-quit.html");
				document.getElementById("exit").addEventListener("click", exitClick);
			}
        }
        else
        {
            window.alert("Warning: Please answer all the question!!");
        }
	};
    record_responses();
}

function exitClick() {
	// Code to run before exiting
	  psiTurk.completeHIT();
  } 

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);

		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt);
				psiTurk.completeHIT();
			},
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});

	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
            	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
            },
            error: prompt_resubmit});
	});


};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
 $(window).load( function(){
     psiTurk.showPage("prequestionnaire.html");
 });
// $(window).load( function(){
//     psiTurk.doInstructions(
//     	instructionPages, // a list of pages you want to display in sequence
//     	function() { currentview = new StroopExperiment(); } // what you want to do when you are done with instructions
//     );
// });
