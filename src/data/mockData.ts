/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StockItem, MenuMeal, ChecklistItem, BirthdayEmployee, Transaction, WasteRecord, SystemLog } from '../types';

export const STOCK_CATEGORIES = [
  "Grãos e Cereais",
  "Carnes e Proteínas",
  "Hortifrúti",
  "Laticínios e Ovos",
  "Temperos e Óleos",
  "Industrializados",
  "Panificação",
  "Bebidas"
];

export const INITIAL_STOCK: StockItem[] = [
  {
    id: "prod-1",
    name: "Arroz Agulhinha Tipo 1",
    barcode: "7891020304012",
    category: "Grãos e Cereais",
    quantity: 150,
    unit: "kg",
    expiryDate: "2026-12-15",
    minQuantity: 40,
    supplier: "Arroz Tio João S/A",
    storageLocation: "Despensa Seca - Setor A"
  },
  {
    id: "prod-2",
    name: "Feijão Carioca Nobre",
    barcode: "7891020304029",
    category: "Grãos e Cereais",
    quantity: 80,
    unit: "kg",
    expiryDate: "2026-10-20",
    minQuantity: 25,
    supplier: "Feijão Kicaldo Ltda",
    storageLocation: "Despensa Seca - Setor A"
  },
  {
    id: "prod-3",
    name: "Peito de Frango Congelado (Cortes)",
    barcode: "7891234567812",
    category: "Carnes e Proteínas",
    quantity: 120,
    unit: "kg",
    expiryDate: "2026-08-30",
    minQuantity: 30,
    supplier: "Seara Alimentos S/A",
    storageLocation: "Cadeia de Frio - Freezer 1"
  },
  {
    id: "prod-4",
    name: "Carne Moída de Patinho",
    barcode: "7891234567829",
    category: "Carnes e Proteínas",
    quantity: 15, // Low stock on purpose
    unit: "kg",
    expiryDate: "2026-06-05", // Near expiry on purpose
    minQuantity: 25,
    supplier: "Friboi Distribuidora",
    storageLocation: "Cadeia de Frio - Freezer 2"
  },
  {
    id: "prod-5",
    name: "Óleo de Soja 900ml",
    barcode: "7891010101011",
    category: "Temperos e Óleos",
    quantity: 45,
    unit: "litros",
    expiryDate: "2027-02-10",
    minQuantity: 15,
    supplier: "Cargill Alimentos",
    storageLocation: "Despensa Seca - Prat. 2"
  },
  {
    id: "prod-6",
    name: "Macarrão Espaguete Sêmola",
    barcode: "7892020202022",
    category: "Grãos e Cereais",
    quantity: 110,
    unit: "kg",
    expiryDate: "2026-11-05",
    minQuantity: 30,
    supplier: "M. Dias Branco",
    storageLocation: "Despensa Seca - Setor B"
  },
  {
    id: "prod-7",
    name: "Molho de Tomate Sachê 340g",
    barcode: "7893030303033",
    category: "Industrializados",
    quantity: 90,
    unit: "unidades",
    expiryDate: "2026-05-15", // Expired on purpose (Date: May 29, 2026)
    minQuantity: 20,
    supplier: "Hemmer Alimentos",
    storageLocation: "Despensa Seca - Prat. 3"
  },
  {
    id: "prod-8",
    name: "Leite Integral UHT",
    barcode: "7894040404044",
    category: "Laticínios e Ovos",
    quantity: 200,
    unit: "litros",
    expiryDate: "2026-07-10",
    minQuantity: 50,
    supplier: "Itambé Laticínios",
    storageLocation: "Câmara Resfriada - Prat. 1"
  },
  {
    id: "prod-9",
    name: "Maçã Gala Nacional",
    barcode: "7895050505055",
    category: "Hortifrúti",
    quantity: 35,
    unit: "kg",
    expiryDate: "2026-06-03", // Near expiry (5 days left)
    minQuantity: 15,
    supplier: "Sacolão Central Distribuição",
    storageLocation: "Hortifrúti Climatizado"
  },
  {
    id: "prod-10",
    name: "Banana Prata de Primeira",
    barcode: "7895050505062",
    category: "Hortifrúti",
    quantity: 12, // Low stock
    unit: "kg",
    expiryDate: "2026-06-01",
    minQuantity: 20,
    supplier: "Sacolão Central Distribuição",
    storageLocation: "Hortifrúti Seco"
  },
  {
    id: "prod-11",
    name: "Batata Inglesa",
    barcode: "7895050505079",
    category: "Hortifrúti",
    quantity: 60,
    unit: "kg",
    expiryDate: "2026-06-12",
    minQuantity: 20,
    supplier: "Ceasa Central",
    storageLocation: "Hortifrúti Seco"
  },
  {
    id: "prod-12",
    name: "Alho Picado Pouch 1kg",
    barcode: "7896060606066",
    category: "Temperos e Óleos",
    quantity: 18,
    unit: "kg",
    expiryDate: "2026-09-18",
    minQuantity: 5,
    supplier: "Alhos Sul Hortifrúti",
    storageLocation: "Câmara Resfriada - Prat. 3"
  },
  {
    id: "prod-13",
    name: "Cebola Desidratada Flocos",
    barcode: "7896060606073",
    category: "Temperos e Óleos",
    quantity: 8,
    unit: "kg",
    expiryDate: "2026-10-01",
    minQuantity: 4,
    supplier: "Ceasa Central",
    storageLocation: "Despensa Seca - Prat. 2"
  },
  {
    id: "prod-14",
    name: "Sal Refinado Iodado 1kg",
    barcode: "7897070707077",
    category: "Temperos e Óleos",
    quantity: 25,
    unit: "kg",
    expiryDate: "2028-05-15",
    minQuantity: 10,
    supplier: "Cisne S/A",
    storageLocation: "Despensa Seca - Prat. 1"
  },
  {
    id: "prod-15",
    name: "Achocolatado em Pó Lata 400g",
    barcode: "7898080808088",
    category: "Industrializados",
    quantity: 40,
    unit: "unidades",
    expiryDate: "2027-01-30",
    minQuantity: 12,
    supplier: "Nestlé Brasil S/A",
    storageLocation: "Despensa Seca - Prat. 4"
  },
  {
    id: "prod-16",
    name: "Pão Francês Unitário",
    barcode: "7899090909099",
    category: "Panificação",
    quantity: 150,
    unit: "unidades",
    expiryDate: "2026-05-30", // Everyday fresh
    minQuantity: 50,
    supplier: "Panificadora Pão de Luz",
    storageLocation: "Cestos de Pão da Cozinha"
  }
];

export const INITIAL_MEALS: MenuMeal[] = [
  {
    id: "meal-1",
    date: "2026-05-25", // Mon
    mealName: "Arroz com Peito de Frango Desfiado e Salada de Batata",
    status: "served",
    studentsCount: 120,
    servedAt: "2026-05-25T11:45:00Z",
    mealType: 'almoco',
    ingredients: [
      { productName: "Arroz Agulhinha Tipo 1", quantityPerStudent: 0.05, unit: "kg", matchedProductId: "prod-1" },
      { productName: "Peito de Frango Congelado (Cortes)", quantityPerStudent: 0.06, unit: "kg", matchedProductId: "prod-3" },
      { productName: "Batata Inglesa", quantityPerStudent: 0.08, unit: "kg", matchedProductId: "prod-11" },
      { productName: "Alho Picado Pouch 1kg", quantityPerStudent: 0.002, unit: "kg", matchedProductId: "prod-12" },
      { productName: "Óleo de Soja 900ml", quantityPerStudent: 0.005, unit: "litros", matchedProductId: "prod-5" }
    ]
  },
  {
    id: "meal-1-snack",
    date: "2026-05-25", // Mon
    mealName: "Salada de Fruta Tropical (Banana, Maçã e Laranja)",
    status: "served",
    studentsCount: 120,
    servedAt: "2026-05-25T08:30:00Z",
    mealType: 'merenda',
    ingredients: [
      { productName: "Banana Prata de Primeira", quantityPerStudent: 0.08, unit: "kg", matchedProductId: "prod-10" },
      { productName: "Maçã Gala Nacional", quantityPerStudent: 0.08, unit: "kg", matchedProductId: "prod-9" }
    ]
  },
  {
    id: "meal-2",
    date: "2026-05-26", // Tue
    mealName: "Macarronada de Patinho com Molho de Tomate",
    status: "served",
    studentsCount: 130,
    servedAt: "2026-05-26T12:00:00Z",
    mealType: 'almoco',
    ingredients: [
      { productName: "Macarrão Espaguete Sêmola", quantityPerStudent: 0.06, unit: "kg", matchedProductId: "prod-6" },
      { productName: "Carne Moída de Patinho", quantityPerStudent: 0.05, unit: "kg", matchedProductId: "prod-4" },
      { productName: "Molho de Tomate Sachê 340g", quantityPerStudent: 0.1, unit: "unidades", matchedProductId: "prod-7" },
      { productName: "Cebola Desidratada Flocos", quantityPerStudent: 0.003, unit: "kg", matchedProductId: "prod-13" },
      { productName: "Sal Refinado Iodado 1kg", quantityPerStudent: 0.002, unit: "kg", matchedProductId: "prod-14" }
    ]
  },
  {
    id: "meal-2-snack",
    date: "2026-05-26", // Tue
    mealName: "Vitamina de Banana Nutritiva com Biscoito Maria",
    status: "served",
    studentsCount: 130,
    servedAt: "2026-05-26T08:30:00Z",
    mealType: 'merenda',
    ingredients: [
      { productName: "Banana Prata de Primeira", quantityPerStudent: 0.05, unit: "kg", matchedProductId: "prod-10" },
      { productName: "Leite Integral UHT", quantityPerStudent: 0.2, unit: "litros", matchedProductId: "prod-8" }
    ]
  },
  {
    id: "meal-3",
    date: "2026-05-27", // Wed
    mealName: "Pão de Chapa com Leite Achocolatado",
    status: "served",
    studentsCount: 140,
    servedAt: "2026-05-27T08:30:00Z",
    mealType: 'merenda',
    ingredients: [
      { productName: "Pão Francês Unitário", quantityPerStudent: 1.0, unit: "unidades", matchedProductId: "prod-16" },
      { productName: "Leite Integral UHT", quantityPerStudent: 0.2, unit: "litros", matchedProductId: "prod-8" },
      { productName: "Achocolatado em Pó Lata 400g", quantityPerStudent: 0.05, unit: "unidades", matchedProductId: "prod-15" }
    ]
  },
  {
    id: "meal-3-lunch",
    date: "2026-05-27", // Wed
    mealName: "Arroz, Feijão Carioca e Iscas de Carne de Patinho Grelhado",
    status: "served",
    studentsCount: 140,
    servedAt: "2026-05-27T12:00:00Z",
    mealType: 'almoco',
    ingredients: [
      { productName: "Arroz Agulhinha Tipo 1", quantityPerStudent: 0.05, unit: "kg", matchedProductId: "prod-1" },
      { productName: "Feijão Carioca Nobre", quantityPerStudent: 0.04, unit: "kg", matchedProductId: "prod-2" },
      { productName: "Carne Moída de Patinho", quantityPerStudent: 0.06, unit: "kg", matchedProductId: "prod-4" }
    ]
  },
  {
    id: "meal-4",
    date: "2026-05-28", // Thu
    mealName: "Sopa Nutritiva de Carne moída com Legumes",
    status: "served",
    studentsCount: 115,
    servedAt: "2026-05-28T11:50:00Z",
    mealType: 'almoco',
    ingredients: [
      { productName: "Carne Moída de Patinho", quantityPerStudent: 0.04, unit: "kg", matchedProductId: "prod-4" },
      { productName: "Batata Inglesa", quantityPerStudent: 0.07, unit: "kg", matchedProductId: "prod-11" },
      { productName: "Macarrão Espaguete Sêmola", quantityPerStudent: 0.02, unit: "kg", matchedProductId: "prod-6" },
      { productName: "Alho Picado Pouch 1kg", quantityPerStudent: 0.001, unit: "kg", matchedProductId: "prod-12" }
    ]
  },
  {
    id: "meal-4-snack",
    date: "2026-05-28", // Thu
    mealName: "Bolo de Milho caseiro com Maçã Fresca",
    status: "served",
    studentsCount: 115,
    servedAt: "2026-05-28T08:30:00Z",
    mealType: 'merenda',
    ingredients: [
      { productName: "Maçã Gala Nacional", quantityPerStudent: 0.1, unit: "kg", matchedProductId: "prod-9" },
      { productName: "Leite Integral UHT", quantityPerStudent: 0.05, unit: "litros", matchedProductId: "prod-8" }
    ]
  },
  {
    id: "meal-5",
    date: "2026-05-29", // Fri - TODAY!
    mealName: "Bobó Especial de Frango desfiado com Arroz de Alho",
    status: "planned",
    studentsCount: 125,
    mealType: 'almoco',
    turn: 'integral',
    ingredients: [
      { productName: "Arroz Agulhinha Tipo 1", quantityPerStudent: 0.05, unit: "kg", matchedProductId: "prod-1" },
      { productName: "Peito de Frango Congelado (Cortes)", quantityPerStudent: 0.07, unit: "kg", matchedProductId: "prod-3" },
      { productName: "Óleo de Soja 900ml", quantityPerStudent: 0.004, unit: "litros", matchedProductId: "prod-5" },
      { productName: "Alho Picado Pouch 1kg", quantityPerStudent: 0.002, unit: "kg", matchedProductId: "prod-12" },
      { productName: "Cebola Desidratada Flocos", quantityPerStudent: 0.003, unit: "kg", matchedProductId: "prod-13" }
    ]
  },
  {
    id: "meal-5-snack-manha",
    date: "2026-05-29", // Fri - TODAY!
    mealName: "Pão Francês com Manteiga e Leite Quente",
    status: "planned",
    studentsCount: 90,
    mealType: 'merenda',
    turn: 'manha',
    ingredients: [
      { productName: "Pão Francês Unitário", quantityPerStudent: 1.0, unit: "unidades", matchedProductId: "prod-16" },
      { productName: "Leite Integral UHT", quantityPerStudent: 0.2, unit: "litros", matchedProductId: "prod-8" }
    ]
  },
  {
    id: "meal-5-snack-tarde",
    date: "2026-05-29", // Fri - TODAY!
    mealName: "Biscoito de Polvilho e Maçã Gala Fresca",
    status: "planned",
    studentsCount: 160,
    mealType: 'merenda',
    turn: 'tarde',
    ingredients: [
      { productName: "Maçã Gala Nacional", quantityPerStudent: 0.1, unit: "kg", matchedProductId: "prod-9" }
    ]
  },
  {
    id: "meal-6",
    date: "2026-06-01", // Mon
    mealName: "Arroz, Feijão Carioca e Frango Grelhado",
    status: "planned",
    studentsCount: 130,
    mealType: 'almoco',
    ingredients: [
      { productName: "Arroz Agulhinha Tipo 1", quantityPerStudent: 0.05, unit: "kg", matchedProductId: "prod-1" },
      { productName: "Feijão Carioca Nobre", quantityPerStudent: 0.04, unit: "kg", matchedProductId: "prod-2" },
      { productName: "Peito de Frango Congelado (Cortes)", quantityPerStudent: 0.07, unit: "kg", matchedProductId: "prod-3" }
    ]
  },
  {
    id: "meal-6-snack",
    date: "2026-06-01", // Mon
    mealName: "Mamão Madurinho Picado com Aveia",
    status: "planned",
    studentsCount: 130,
    mealType: 'merenda',
    ingredients: [
      { productName: "Banana Prata de Primeira", quantityPerStudent: 0.05, unit: "kg", matchedProductId: "prod-10" }
    ]
  },
  {
    id: "meal-7",
    date: "2026-06-02", // Tue
    mealName: "Banana e Macarrão Alho e Óleo com Cubos de Peito de Frango",
    status: "planned",
    studentsCount: 120,
    mealType: 'almoco',
    ingredients: [
      { productName: "Macarrão Espaguete Sêmola", quantityPerStudent: 0.06, unit: "kg", matchedProductId: "prod-6" },
      { productName: "Peito de Frango Congelado (Cortes)", quantityPerStudent: 0.08, unit: "kg", matchedProductId: "prod-3" },
      { productName: "Banana Prata de Primeira", quantityPerStudent: 0.1, unit: "kg", matchedProductId: "prod-10" }
    ]
  },
  {
    id: "meal-7-snack",
    date: "2026-06-02", // Tue
    mealName: "Biscoito de Polvilho e Suco Natural",
    status: "planned",
    studentsCount: 120,
    mealType: 'merenda',
    ingredients: [
      { productName: "Banana Prata de Primeira", quantityPerStudent: 0.05, unit: "kg", matchedProductId: "prod-10" }
    ]
  }
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: "chk-1", task: "Limpeza das bancadas de corte e preparo", responsible: "Dona Maria de Souza", completed: true, completedTime: "07:30" },
  { id: "chk-2", task: "Higienização das panelas e utensílios", responsible: "Reginaldo Silva", completed: true, completedTime: "08:15" },
  { id: "chk-3", task: "Varrição completa e higienização do chão com cloro", responsible: "Reginaldo Silva", completed: false },
  { id: "chk-4", task: "Limpeza externa e organização do freezer e geladeiras", responsible: "Dona Maria de Souza", completed: false },
  { id: "chk-5", task: "Retirada do lixo orgânico e reciclável para o container externo", responsible: "Reginaldo Silva", completed: false },
  { id: "chk-6", task: "Verificação visual de pragas e organização da despensa", responsible: "Carlos Oliveira", completed: true, completedTime: "09:00" }
];

export const INITIAL_EMPLOYEES: BirthdayEmployee[] = [
  {
    id: "emp-1",
    name: "Maria de Souza (Dona Maria)",
    birthDate: "1972-05-29", // Birthday is TODAY! (May 29)
    role: "Chefe de Cozinha / Cozinheira",
    avatar: "👩‍🍳"
  },
  {
    id: "emp-2",
    name: "Carlos Oliveira",
    birthDate: "1985-05-15", // In current month (May)
    role: "Estoquista Chefe",
    avatar: "👨‍📦"
  },
  {
    id: "emp-3",
    name: "Ana Paula Medeiros",
    birthDate: "1979-06-03", // Next month
    role: "Diretora Escolar",
    avatar: "👩‍💼"
  },
  {
    id: "emp-4",
    name: "Reginaldo Silva",
    birthDate: "1993-05-30", // Birthday TOMORROW! (May 30)
    role: "Auxiliar de Cozinha",
    avatar: "👨‍🍳"
  },
  {
    id: "emp-5",
    name: "Juliana Costa",
    birthDate: "1988-11-22",
    role: "Nutricionista Técnica",
    avatar: "👩‍⚕️"
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "tx-1", type: "entrada", productId: "prod-1", productName: "Arroz Agulhinha Tipo 1", quantity: 100, unit: "kg", date: "2026-05-24T09:00:00Z", user: "Carlos Oliveira", source: "manual" },
  { id: "tx-2", type: "entrada", productId: "prod-2", productName: "Feijão Carioca Nobre", quantity: 50, unit: "kg", date: "2026-05-24T09:10:00Z", user: "Carlos Oliveira", source: "manual" },
  { id: "tx-3", type: "entrada", productId: "prod-3", productName: "Peito de Frango Congelado (Cortes)", quantity: 80, unit: "kg", date: "2026-05-24T10:15:00Z", user: "Carlos Oliveira", source: "camera" },
  { id: "tx-4", type: "saida", productId: "prod-1", productName: "Arroz Agulhinha Tipo 1", quantity: 6, unit: "kg", date: "2026-05-25T11:45:00Z", user: "Dona Maria de Souza", source: "cardapio" },
  { id: "tx-5", type: "saida", productId: "prod-3", productName: "Peito de Frango Congelado (Cortes)", quantity: 7.2, unit: "kg", date: "2026-05-25T11:45:00Z", user: "Dona Maria de Souza", source: "cardapio" },
  { id: "tx-6", type: "saida", productId: "prod-6", productName: "Macarrão Espaguete Sêmola", quantity: 7.8, unit: "kg", date: "2026-05-26T12:00:00Z", user: "Dona Maria de Souza", source: "cardapio" },
  { id: "tx-7", type: "saida", productId: "prod-16", productName: "Pão Francês Unitário", quantity: 140, unit: "unidades", date: "2026-05-27T08:30:00Z", user: "Dona Maria de Souza", source: "cardapio" }
];

export const INITIAL_WASTE: WasteRecord[] = [
  { id: "w-1", date: "2026-05-25", mealName: "Arroz com Peito de Frango Desfiado", studentsRegistered: 120, studentsServed: 112, wasteQuantityKg: 1.8, reason: "Restos de prato de alunos" },
  { id: "w-2", date: "2026-05-26", mealName: "Macarronada de Patinho", studentsRegistered: 130, studentsServed: 128, wasteQuantityKg: 0.9, reason: "Sobras de porcionamento na panela" },
  { id: "w-3", date: "2026-05-27", mealName: "Pão de Chapa com Leite Achocolatado", studentsRegistered: 140, studentsServed: 140, wasteQuantityKg: 0.2, reason: "Pouquíssima sobra de leite" },
  { id: "w-4", date: "2026-05-28", mealName: "Sopa Nutritiva", studentsRegistered: 115, studentsServed: 104, wasteQuantityKg: 3.5, reason: "Rejeição alta de vegetais por alunos mais jovens" }
];

export const INITIAL_SYSTEM_LOGS: SystemLog[] = [
  { id: "log-1", timestamp: "2026-05-29T08:00:00Z", username: "Carlos Oliveira", role: "Estoquista", action: "Login", details: "Autenticado com sucesso via console escolar" },
  { id: "log-2", timestamp: "2026-05-29T08:15:00Z", username: "Carlos Oliveira", role: "Estoquista", action: "Entrada de Produto", details: "Registrada entrada manual de 50 litros de Leite UHT" },
  { id: "log-3", timestamp: "2026-05-29T08:30:00Z", username: "Maria de Souza (Dona Maria)", role: "Cozinheira", action: "Execução do Checklist", details: "Marcou 'Limpeza das bancadas de preparo' como concluído" },
  { id: "log-4", timestamp: "2026-05-29T09:02:00Z", username: "Ana Paula Medeiros", role: "Diretor", action: "Exportação de Dados", details: "Gerou relatório completo de desperdício em CSV" }
];
