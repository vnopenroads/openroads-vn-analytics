/*
  Specifies details for the various fields for different sections.
  These fields are defined as iD presets.
  To regenerate this data, run the `export-json.js` file in this folder inside the
  iD/data/presets/fields folder
*/

module.exports = {
  'or_condition': {
    'label': 'Road condition',
    'strings': {
      'options': {
        'bad': 'Bad',
        'poor': 'Poor',
        'fair': 'Fair',
        'good': 'Good',
        'excellent': 'Excellent'
      }
    }
  },
  'or_grade': {
    'label': 'Openroads grade',
    'strings': {
      'options': {
        '1': 'Poor',
        '2': 'Mediocre',
        '3': 'Acceptable',
        '4': 'Good',
        '5': 'Great'
      }
    }
  },
  'or_link': {
    'label': 'Link ID'
  },
  'or_link_class': {
    'label': 'Link Road Class',
    'strings': {
      'options': {
        '1': 'Class I',
        '2': 'Class II',
        '3': 'Class III',
        '4': 'Class IV',
        '5': 'Class V',
        '6': 'Class VI',
        '7': 'Class A',
        'A': 'Class B',
        'B': 'Class C',
        'C': 'Class D'
      }
    }
  },
  'or_link_direct_population': {
    'label': 'Link Direct Population Service'
  },
  'or_link_district_gso': {
    'label': 'Link District GSO'
  },
  'or_link_indirect_population': {
    'label': 'Link Indirect Population Service'
  },
  'or_link_length': {
    'label': 'Link Length'
  },
  'or_link_name': {
    'label': 'Link Name'
  },
  'or_lock': {
    'label': 'Lock geometry'
  },
  'or_responsibility': {
    'label': 'Road responsibility',
    'strings': {
      'options': {
        'national': 'National',
        'provincial': 'Provincial',
        'district': 'District',
        'commune': 'Commune',
        'village': 'Village',
        'urban': 'Urban',
        'special': 'Special'
      }
    }
  },
  'or_section': {
    'label': 'Section ID'
  },
  'or_section_articulated_truck': {
    'label': 'Section Articulated Truck Traffic (veh/day)'
  },
  'or_section_carraigeway': {
    'label': 'Section Carraigeway Width'
  },
  'or_section_commune_gso': {
    'label': 'Section Commune GSO'
  },
  'or_section_delivery_vehicle': {
    'label': 'Section Delivery Vehicle Traffic (veh/day)'
  },
  'or_section_four_wheel': {
    'label': 'Section Four Wheel Traffic (veh/day)'
  },
  'or_section_heavy_truck': {
    'label': 'Section Heavy Truck Traffic (veh/day)'
  },
  'or_section_lanes': {
    'label': 'Section Number of Lanes',
    'strings': {
      'options': {
        '1': 'One Lane',
        '2': 'Narrow Two Lanes',
        '3': 'Two Lanes',
        '4': 'Wide Two Lanes',
        '5': 'Four Lanes',
        '6': 'Six Lanes',
        '7': 'Eight Lanes'
      }
    }
  },
  'or_section_large_bus': {
    'label': 'Section Large Bus Traffic (veh/day)'
  },
  'or_section_length': {
    'label': 'Section Length'
  },
  'or_section_light_truck': {
    'label': 'Section Light Truck Traffic (veh/day)'
  },
  'or_section_medium_bus': {
    'label': 'Section Medium Bus Traffic (veh/day)'
  },
  'or_section_medium_car': {
    'label': 'Section Medium Car Traffic (veh/day)'
  },
  'or_section_medium_truck': {
    'label': 'Section Medium Truck Traffic (veh/day)'
  },
  'or_section_moisture': {
    'label': 'Section Moisture Class',
    'strings': {
      'options': {
        '1': 'Arid',
        '2': 'Semi-arid',
        '3': 'Sub-humid',
        '4': 'Humid',
        '5': 'Per-humid'
      }
    }
  },
  'or_section_motorcycle': {
    'label': 'Section Motorcycle Traffic (veh/day)'
  },
  'or_section_name': {
    'label': 'Section Name'
  },
  'or_section_pavement': {
    'label': 'Section Pavement Type',
    'strings': {
      'options': {
        '1': 'Paved',
        '2': 'Unpaved'
      }
    }
  },
  'or_section_pavement_age': {
    'label': 'Section Pavement Age'
  },
  'or_section_pavement_condition': {
    'label': 'Section Pavement Condition Class',
    'strings': {
      'options': {
        '1': 'Very Good',
        '2': 'Good',
        '3': 'Fair',
        '4': 'Poor',
        '5': 'Very Poor'
      }
    }
  },
  'or_link_sequence': {
    'label': 'Section Sequence Number'
  },
  'or_section_small_bus': {
    'label': 'Section Small Bus Traffic (veh/day)'
  },
  'or_section_small_car': {
    'label': 'Section Small Car Traffic (veh/day)'
  },
  'or_section_surface': {
    'label': 'Section Surface Type',
    'strings': {
      'options': {
        '1': 'Cement Concrete',
        '2': 'Asphalt Concrete',
        '3': 'Surface Treatment',
        '4': 'Gravel',
        '5': 'Earth',
        '6': 'Macadam',
        '7': 'Cobblestone'
      }
    }
  },
  'or_section_temperature': {
    'label': 'Section Temperature Class',
    'strings': {
      'options': {
        '1': 'Tropical',
        '2': 'Sub-tropical Hot',
        '3': 'Sub-tropical Cool',
        '4': 'Temperature Cool',
        '5': 'Temperature Freeze'
      }
    }
  },
  'or_section_terrain': {
    'label': 'Section Terrain Type',
    'strings': {
      'options': {
        '1': 'Flat',
        '2': 'Hilly',
        '3': 'Mountainous'
      }
    }
  },
  'or_section_traffic': {
    'label': 'Section Traffic Level',
    'strings': {
      'options': {
        '1': '< 50',
        '2': '51 - 100',
        '3': '101 - 250',
        '4': '251 - 500',
        '5': '501 - 1000',
        '6': '1001 - 3000',
        '7': '3001 - 5000',
        '8': '5001 - 7000',
        '9': '7001 - 9000',
        '10': '9001 - 12000',
        '11': '12001 - 15000',
        '12': '15001 - 20000',
        '13': '20001 - 30000'
      }
    }
  },
  'or_section_traffic_growth': {
    'label': 'Section Traffic Annual Growth Scenario',
    'strings': {
      'options': {
        '1': 'Very Low',
        '2': 'Low',
        '3': 'Medium',
        '4': 'High',
        '5': 'Very High'
      }
    }
  },
  'or_vpromms': {
    'label': 'VProMMS ID'
  },
  'or_width': {
    'label': 'Road width',
    'strings': {
      'options': {
        '3': '3 meters',
        '4': '4 meter',
        '5': '5 meters',
        '6': '6 meters',
        '-3': '< 3 meters',
        '6+': '> 6 meters'
      }
    }
  }
};
