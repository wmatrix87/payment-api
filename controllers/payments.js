const currentDate = () => new Date().toISOString();
const paymentCamelCase = (payment) => ({
  id: payment.id.toString(),
  payeeId: payment.payee_id,
  payerId: payment.payer_id,
  paymentSystem: payment.payment_system,
  paymentMethod: payment.payment_method,
  amount: payment.amount,
  currency: payment.currency,
  comment: payment.comment,
  created: payment.created,
  updated: payment.updated,
});
const paymentsCamelCase = (payments) => payments.map(paymentCamelCase);

const getPayments = async (req, res, db) => {
  try {

    const result = await db.select('*').from('payments')
    res.json(paymentsCamelCase(result));
  } catch (e) {
    console.error('Error: ', e.message);
    res.status(400).json(e)
  }
}

const getPayment = async (req, res, db) => {
  try {
    const { id } = req.params;
    const result = await db.select('*').from('payments').where('id', '=', parseInt(id));
    res.json(paymentCamelCase(result[0]));
  } catch (e) {
    console.error('Error: ', e.message);
    res.status(400).json(e)
  }
}

const createPayment = async (req, res, db) => {
  const { payeeId, payerId, paymentSystem, paymentMethod, amount, currency, comment } = req.body;
  
  try {
    const result = await db
      .returning('id')
      .insert({
        payee_id: payeeId,
        payer_id: payerId,
        payment_system: paymentSystem,
        payment_method: paymentMethod,
        amount,
        currency,
        comment,
        created: currentDate(),
        updated: currentDate(),
      }).into('payments');
    res.json(result[0] || undefined)
  } catch (e) {
    console.error('Error: ', e.message);
    res.status(400).json(e)
  }
}

module.exports = {
  getPayments,
  getPayment,
  createPayment,
}
