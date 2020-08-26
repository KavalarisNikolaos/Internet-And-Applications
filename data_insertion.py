import xml.etree.ElementTree as ET
from pymongo import MongoClient
import os

def parseXML(directory, file):
    print(file)
    
    tree = ET.parse(os.path.join(directory, file))
    root = tree.getroot()
    
    data = dict()
    condition =  []

    for elem in root.iter():
        if(elem.tag in fields):
            if elem.tag == 'required_header':
                data[elem.tag] = elem[2].text
            elif elem.tag == 'condition':
                condition.append({'cond_name':elem.text})
            elif elem.tag == 'criteria':
                data[elem.tag] = elem[0].text
            elif elem.tag == 'brief_summary':
                data[elem.tag] = elem[0].text
            else:
                data[elem.tag] = elem.text

    data['condition']    = condition
    
    return data

fields = set(['url', 'brief_summary', 'condition','criteria'])

client = MongoClient('localhost', 27017)
db = client['clinicalTrials']
collection = db['data']


directory = './AllPublicXML'

for folder in os.listdir(directory):
    if folder.endswith(".txt"):
        continue
    for filename in os.listdir(os.path.join(directory, folder)):
        data = parseXML(directory+'/'+folder,filename)
        collection.insert_one(data)

client.close()
